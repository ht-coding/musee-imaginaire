import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const exhibitId = Number(params.id);
	const results = await db
		.select({
			exhibit: table.exhibit,
			artwork: table.artwork,
			link: table.exhibitToArtworks
		})
		.from(table.exhibit)
		.leftJoin(table.exhibitToArtworks, eq(table.exhibit.id, table.exhibitToArtworks.exhibitId))
		.leftJoin(
			table.artwork,
			and(
				eq(table.exhibitToArtworks.artworkId, table.artwork.artworkId),
				eq(table.exhibitToArtworks.artworkCollectionId, table.artwork.collectionId)
			)
		)
		.where(eq(table.exhibit.id, exhibitId));

	if (results.length === 0 || !results[0].exhibit) {
		throw error(404, 'Exhibit not found');
	}

	const exhibit = results[0].exhibit;

	const artworks = results
		.filter((row) => row.link) // only artworks with a junction entry
		.map((row) => ({
			...row.artwork!,
			addedAt: row.link!.addedAt
		}));

	return {
		exhibit,
		artworks
	};
};
