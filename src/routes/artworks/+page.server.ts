import { isApiStale } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const query = url.searchParams.get('q');
		const order = url.searchParams.get('order');
		const category = url.searchParams.get('category') || 'Title';
		const refreshData = await isApiStale();

		if (refreshData) {
			return { refreshing: true, artworks: [] };
		}
		const response = await fetch('/api/artworks');
		const artworks = await response.json();

		return {
			refreshing: false,
			artworks,
			page,
			query,
			order,
			category
		};
	} catch (error) {
		console.error(`Failed to fetch artworks: ${error}`);
	}
};
