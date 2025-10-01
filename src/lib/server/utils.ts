import type { Artwork } from '$lib/server/db/schema';

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
	const { records } = await response.json();
	if (!records || records.length === 0) {
		return accumulatedRecords;
	}

	const filteredRecords = records.filter(
		(record: HarvardRecord) => record.imagepermissionlevel === 0 && record.primaryimageurl
	);

	const finalRecords = accumulatedRecords.concat(filteredRecords);

	if (finalRecords.length >= numberOfRecords) {
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
		accessionYear: record.accessionyear,
		creditLine: record.creditline ?? 'Unknown',
		department: record.division,
		title: record.title,
		medium: record.medium,
		description: record.description ?? 'Visit the Harvard Art Museums website for more information'
	}));
}

function delay(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

type MetRecord = {
	primaryImage: string;
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
	const metResponse = await fetch(
		`${metApiUrl}?departmentIds=11&hasImages=true&isPublicDomain=true`
	);
	const { objectIDs } = await metResponse.json();

	const results = [];
	for (const id of objectIDs.slice(0, numberOfRecords)) {
		await delay(35);

		const response = await fetch(`${metApiUrl}/${id}`);
		const record: MetRecord = await response.json();
		const recordWithId: MetRecordWithId = { id, ...record };
		results.push(recordWithId);
	}
	return results;
}

export async function parseMetData(records: MetRecordWithId[]): Promise<Artwork[]> {
	return records.map((record) => ({
		artworkId: record.id,
		collectionId: 'Met',
		collection: 'The Metropolitan Museum of Art',
		imageURL: record.primaryImage,
		artworkURL: record.objectURL,
		accessionYear: parseInt(record.accessionYear),
		creditLine: record.creditLine,
		department: record.department,
		title: record.title,
		medium: record.medium,
		description: 'Visit the Met website to learn more.'
	}));
}
