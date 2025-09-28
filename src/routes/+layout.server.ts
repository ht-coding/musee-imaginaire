import { HARVARD_API_KEY } from '$env/static/private';
const harvardApi = `https://api.harvardartmuseums.org/object?apikey=${HARVARD_API_KEY}&size=100&hasimage=1&q=*&imagepermissionlevel=0&classification=Paintings`;
const metApi = 'https://collectionapi.metmuseum.org/public/collection/v1/';

export async function load({ fetch }) {
	const harvardResponse = await fetch(harvardApi);
	const { records } = await harvardResponse.json();
	const harvardCollection = records.map((item) => {
		return {
			id: item.id,
			collection: 'Harvard Art Museums',
			collectionId: 'Harvard',
			imageURL: item.primaryimageurl,
			itemURL: item.url,
			accessionYear: item.accessionyear,
			creditLine: item.creditline,
			department: item.division,
			title: item.title,
			medium: item.medium,
			description:
				item.description || 'Visit the Harvard       Art Museums website for more information'
		};
	});

	const metResponse = await fetch(
		metApi + 'objects?departmentIds=11&hasImages=true&isPublicDomain=true'
	);
	const { objectIDs } = await metResponse.json();

	const metCollection = objectIDs.slice(0, 30).map(async (id: Number) => {
		const response = await fetch(metApi + 'objects/' + id);
		const object = await response.json();
		return {
			id: object.objectId,
			collection: 'The Metropolitan Museum of Art',
			collectionID: 'Met',
			imageURL: object.primaryImage,
			itemURL: object.objectURL,
			accessionYear: object.accessionYear,
			creditLine: object.creditLine,
			department: object.department,
			title: object.title,
			medium: object.medium,
			description: 'Visit the Met website to learn more.'
		};
	});

	return { harvardCollection, metCollection };
}
