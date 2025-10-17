import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const response = await fetch(`/api/artworks/${params.id}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch artwork: ${response.status}`);
	}

	const artwork = await response.json();
	return {
		artwork
	};
};
