import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from '../$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
	const response = await fetch(`/api/artworks/${params.id}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch artwork: ${response.status}`);
	}
	const artwork = await response.json();
	let exhibits = [];
	if (locals.user) {
		const response = await fetch(`/api/users/${locals.user.username}/exhibits`);
		if (!response.ok) {
			throw new Error(`Failed to fetch exhibits: ${response.status}`);
		}
		exhibits = await response.json();
	}
	return {
		artwork,
		exhibits
	};
};
export const actions: Actions = {
	addToExhibit: async (event) => {
		const formData = await event.request.formData();
		const exhibitId = Number(formData.get('exhibitToAddTo'));
		const artworkId = Number(formData.get('artworkId'));
		const artworkCollectionId = formData.get('collectionId') as string;
		if (exhibitId === 0) {
			return fail(400, {
				message: 'You need to select an exhibit first.'
			});
		}
		const currentArtworks = await db
			.select()
			.from(table.exhibitToArtworks)
			.where(eq(table.exhibitToArtworks.exhibitId, Number(exhibitId)));
		const alreadyExists = currentArtworks.some(
			(artwork) =>
				artwork.artworkCollectionId === artworkCollectionId && artwork.artworkId === artworkId
		);
		if (alreadyExists) {
			return fail(400, {
				message: 'This artwork is already in that exhibit!'
			});
		}
		await db.insert(table.exhibitToArtworks).values({
			exhibitId,
			artworkId,
			artworkCollectionId
		});
		return redirect(303, '/exhibits/' + exhibitId);
	}
};
