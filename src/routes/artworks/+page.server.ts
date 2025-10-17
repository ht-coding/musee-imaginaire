import { isApiStale } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const refreshData = await isApiStale();

	if (refreshData) {
		return { refreshing: true, artworks: [] };
	}

	const response = await fetch('/api/artworks');

	if (!response.ok) {
		throw new Error(`Failed to fetch artworks: ${response.status}`);
	}

	const artworks = await response.json();

	return {
		refreshing: false,
		artworks
	};
};
