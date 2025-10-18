import { fetchExhibits } from '$lib/server/utils';

export async function load() {
	const exhibits = await fetchExhibits({ includeEmptyExhibits: false });
	return {
		exhibits
	};
}
