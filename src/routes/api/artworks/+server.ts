import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { isApiStale, refreshApi } from '$lib/server/utils';
import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function GET() {
	const updateData = await isApiStale();

	if (updateData) {
		console.log('refreshing');
		await refreshApi();
	}

	const artworks = await db.select().from(table.artwork);
	const artworksWithArtists = await Promise.all(
		artworks.map(async (artwork) => {
			const artistsResults = await db
				.select()
				.from(table.artist)
				.innerJoin(
					table.artistsToArtworks,
					and(
						eq(table.artist.id, table.artistsToArtworks.artistId),
						eq(table.artistsToArtworks.artworkId, artwork.artworkId),
						eq(table.artistsToArtworks.artworkCollectionId, artwork.collectionId)
					)
				);
			const artists = artistsResults.map((row) => row.artist);
			return { ...artwork, artists };
		})
	);
	return json(artworksWithArtists);
}
