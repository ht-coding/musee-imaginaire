import type { Artwork } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { HARVARD_API_KEY } from '$env/static/private';

function delay(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

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
};

export async function fetchHarvardData(
	apiKey: string,
	numberOfRecords: number,
	page: number = 1,
	accumulatedRecords: HarvardRecord[] = []
): Promise<HarvardRecord[]> {
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

	const filteredRecords = records.filter(
		(record: HarvardRecord) => record.imagepermissionlevel === 0 && record.primaryimageurl
	);

	const finalRecords = accumulatedRecords.concat(filteredRecords);

	if (finalRecords.length >= numberOfRecords) {
		await delay(35);

		return finalRecords.slice(0, numberOfRecords);
	}

	return fetchHarvardData(apiKey, numberOfRecords, page + 1, finalRecords);
}

export async function parseHarvardData(records: HarvardRecord[]): Promise<Artwork[]> {
	return records.map((record) => ({
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
		description: record.description ?? 'Visit the Harvard Art Museums website for more information'
	}));
}

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
};
type MetRecordWithId = MetRecord & { id: number };

export async function fetchMetData(numberOfRecords: number): Promise<MetRecordWithId[]> {
	const metApiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
	const response = await fetch(`${metApiUrl}?departmentIds=11`);
	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Fetch failed: Metropolitan Museum of Art, /objects, ${response.status} ${response.statusText}\n${text}`
		);
	}
	const { objectIDs } = await response.json();

	const results = [];
	for (const id of objectIDs) {
		if (results.length === numberOfRecords) break;
		await delay(35);
		const response = await fetch(`${metApiUrl}/${id}`);
		if (!response.ok) {
			const text = await response.text();
			throw new Error(
				`Fetch failed: Metropolitan Museum of Art, /objects/${id}, ${response.status} ${response.statusText}\n${text}`
			);
		}
		const record: MetRecord = await response.json();
		if (record.isPublicDomain && record.primaryImage) {
			const recordWithId: MetRecordWithId = { id, ...record };
			results.push(recordWithId);
		}
	}
	return results;
}

export async function parseMetData(records: MetRecordWithId[]): Promise<Artwork[]> {
	return records.map((record) => ({
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
		description: 'Visit the Met website to learn more.'
	}));
}

export async function updateArtworks(collection: Artwork[]) {
	return collection.forEach(async (artwork) =>
		db
			.insert(table.artworks)
			.values(artwork)
			.onConflictDoUpdate({
				target: [table.artworks.artworkId, table.artworks.collectionId],
				set: artwork
			})
	);
}

export async function isApiStale(): Promise<boolean> {
	const [apiRefreshLog] = await db.select().from(table.apiRefreshLog);

	if (!apiRefreshLog) return true;

	const lastRefresh = apiRefreshLog.lastRefresh;
	const lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);

	return lastRefresh < lastMonth;
}

export async function refreshApi() {
	const harvardRawData = await fetchHarvardData(HARVARD_API_KEY, 50);
	const harvardParsedData = await parseHarvardData(harvardRawData);

	const metRawData = await fetchMetData(50);
	const metParsedData = await parseMetData(metRawData);

	updateArtworks([...harvardParsedData, ...metParsedData]);
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
