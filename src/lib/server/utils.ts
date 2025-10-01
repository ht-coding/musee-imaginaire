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
