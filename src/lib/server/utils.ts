import type { Artwork, Artist } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { HARVARD_API_KEY } from '$env/static/private';
import type { InferInsertModel } from 'drizzle-orm';

type HarvardRecord = {
	id: number;
	primaryimageurl: string;
	title: string;
	url: string;
	accessionyear: number;
	creditline: string;
	division: string;
	medium: string;
	imagepermissionlevel: number;
	description?: string;
	images: [{ description: string; width: number; height: number }];
	people: {
		role: string;
		gender: string;
		culture: string;
		displayname: string;
		displaydate: string;
	}[];
};
type ParsedHarvardRecord = HarvardRecord & {
	origin: 'harvard';
};
type MetRecord = {
	isPublicDomain: boolean;
	primaryImage: string;
	primaryImageSmall: string;
	objectURL: string;
	accessionYear: string;
	creditLine: string;
	department: string;
	title: string;
	medium: string;
	tags: [{ term: string }];
	measurements: [{ elementMeasurements: { Height: number; Width: number } }];
	artistDisplayName: string;
	artistNationality: string;
	artistBeginDate: number;
	artistEndDate: number;
	artistGender: string;
};
type ParsedMetRecord = MetRecord & { origin: 'met'; id: number };
type ArtworkRecord = ParsedMetRecord | ParsedHarvardRecord;
type NewArtist = InferInsertModel<typeof table.artist>;

export async function fetchHarvardData(
	apiKey: string,
	numberOfRecords: number,
	page: number = 1,
	accumulatedRecords: ParsedHarvardRecord[] = []
): Promise<ParsedHarvardRecord[]> {
	const harvardApiUrl = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=${numberOfRecords}&hasimage=1&q=*&classification=Paintings&page=${page}`;
	const response = await fetch(harvardApiUrl);
	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Fetch failed: Harvard, ${response.status} ${response.statusText}\n${text}`);
	}
	const { records } = await response.json();
	if (!records || records.length === 0) {
		return accumulatedRecords;
	}

	const filteredRecords: ParsedHarvardRecord[] = records
		.filter(
			(record: HarvardRecord) =>
				record.imagepermissionlevel === 0 &&
				record.primaryimageurl &&
				Array.isArray(record.people) &&
				record.people.length > 0
		)
		.map((record: HarvardRecord) => ({ ...record, origin: 'harvard' }));

	const finalRecords = accumulatedRecords.concat(filteredRecords);

	if (finalRecords.length >= numberOfRecords) {
		await delay(35);

		return finalRecords.slice(0, numberOfRecords);
	}

	return fetchHarvardData(apiKey, numberOfRecords, page + 1, finalRecords);
}

export function harvardRecordToArtwork(record: HarvardRecord): Artwork {
	return {
		artworkId: record.id,
		collection: 'Harvard Art Museums',
		collectionId: 'Harvard',
		imageURL: record.primaryimageurl,
		artworkURL: record.url,
		thumbnailURL: record.primaryimageurl + '?height=400&width=600',
		accessionYear: record.accessionyear,
		creditLine: record.creditline ?? 'Unknown',
		department: record.division,
		title: record.title,
		medium: record.medium,
		description: record.description ?? 'Visit the Harvard Art Museums website for more information',
		alt: record.images[0].description ?? '',
		height: record.images[0].height,
		width: record.images[0].width
	};
}

export async function fetchMetData(numberOfRecords: number): Promise<ParsedMetRecord[]> {
	const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
	const response = await fetch(`${baseUrl}?departmentIds=11`);
	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Fetch failed: Metropolitan Museum of Art, /objects, ${response.status} ${response.statusText}\n${text}`
		);
	}
	const { objectIDs } = await response.json();

	const results: ParsedMetRecord[] = [];
	for (const id of objectIDs) {
		if (results.length === numberOfRecords) break;

		await delay(35);

		const response = await fetch(`${baseUrl}/${id}`);

		if (!response.ok) {
			const text = await response.text();
			throw new Error(
				`Fetch failed: Metropolitan Museum of Art, /objects/${id}, ${response.status} ${response.statusText}\n${text}`
			);
		}

		const record: MetRecord = await response.json();

		if (record.isPublicDomain && record.primaryImage) {
			results.push({ origin: 'met', id, ...record });
		}
	}
	return results;
}

export function metRecordToArtwork(record: ParsedMetRecord): Artwork {
	return {
		artworkId: record.id,
		collectionId: 'Met',
		collection: 'The Metropolitan Museum of Art',
		imageURL: record.primaryImage,
		thumbnailURL: record.primaryImageSmall,
		artworkURL: record.objectURL,
		accessionYear: parseInt(record.accessionYear),
		creditLine: record.creditLine,
		department: record.department,
		title: record.title,
		medium: record.medium,
		description: 'Visit the Met website to learn more.',
		alt: createAlt(record),
		height: record.measurements[0].elementMeasurements.Height,
		width: record.measurements[0].elementMeasurements.Width
	};
}

async function upsertArtworks(rawData: ArtworkRecord[]) {
	const data = rawData.map((record) => {
		if (record.origin === 'met') {
			return { record, artworkData: metRecordToArtwork(record) };
		} else {
			return { record, artworkData: harvardRecordToArtwork(record) };
		}
	});
	return Promise.all(
		data.map(async (artwork) => {
			try {
				await db
					.insert(table.artwork)
					.values(artwork.artworkData)
					.onConflictDoUpdate({
						target: [table.artwork.artworkId, table.artwork.collectionId],
						set: artwork.artworkData
					});
				await fetchOrInsertArtist(artwork.record);
			} catch (error) {
				console.error('Failed to update artwork:', artwork, error);
			}
		})
	);
}

async function fetchOrInsertArtist(record: ArtworkRecord) {
	if (record.origin === 'harvard') {
		const artists = record.people.filter((person) => person.role === 'Artist');
		await Promise.all(
			artists.map(async (artist) => {
				const artistData = {
					name: artist.displayname,
					culture: artist.culture,
					years: artist.displaydate,
					gender: artist.gender
				};
				const artistId = await upsertArtist(artistData);
				await linkArtistToArtwork(artistId, record.id, 'Harvard');
			})
		);
	} else {
		const artistData = {
			name: record.artistDisplayName,
			culture: record.artistNationality,
			years: `${record.artistBeginDate} - ${record.artistEndDate}`,
			gender: record.artistGender
		};
		const artistId = await upsertArtist(artistData);
		await linkArtistToArtwork(artistId, record.id, 'Met');
	}
}
async function upsertArtist(artist: NewArtist) {
	const results = await db
		.insert(table.artist)
		.values(artist)
		.onConflictDoUpdate({
			target: [table.artist.name, table.artist.culture],
			set: artist
		})
		.returning({ id: table.artist.id });
	return results[0]?.id;
}
async function linkArtistToArtwork(
	artistId: number,
	artworkId: number,
	artworkCollectionId: string
) {
	return db
		.insert(table.artistsToArtworks)
		.values({
			artistId,
			artworkId,
			artworkCollectionId
		})
		.onConflictDoNothing();
}

export async function isApiStale(): Promise<boolean> {
	const [apiRefreshLog] = await db.select().from(table.apiRefreshLog);

	if (!apiRefreshLog) return true;

	const lastRefresh = apiRefreshLog.lastRefresh;
	const lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);

	return lastRefresh < lastMonth;
}

function delay(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function createAlt(record: ParsedMetRecord): string {
	const tagsString =
		Array.isArray(record.tags) && record.tags.length
			? record.tags.map((tag) => tag.term).join(', ') + ','
			: '';
	return `${tagsString}${record.medium}`;
}

export async function refreshApi() {
	const harvardData = await fetchHarvardData(HARVARD_API_KEY, 2);
	const metData = await fetchMetData(2);

	await upsertArtworks([...harvardData, ...metData]);
	await db
		.insert(table.apiRefreshLog)
		.values({
			id: 1,
			lastRefresh: new Date()
		})
		.onConflictDoUpdate({
			target: table.apiRefreshLog.id,
			set: { lastRefresh: new Date() }
		});
}
