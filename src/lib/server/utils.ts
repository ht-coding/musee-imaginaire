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
	numberOfRecords: number
): Promise<HarvardRecord[]> {
	const harvardApiUrl = `https://api.harvardartmuseums.org/object?apikey=${apiKey}&size=${numberOfRecords}&hasimage=1&q=*&classification=Paintings`;
	const harvardResponse = await fetch(harvardApiUrl);
	const { records } = await harvardResponse.json();
	return records;
}
