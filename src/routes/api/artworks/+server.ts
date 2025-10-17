import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function GET() {
	const joined = await db
		.select()
		.from(table.artwork)
		.leftJoin(
			table.artistsToArtworks,
			and(
				eq(table.artwork.artworkId, table.artistsToArtworks.artworkId),
				eq(table.artwork.collectionId, table.artistsToArtworks.artworkCollectionId)
			)
		)
		.leftJoin(table.artist, eq(table.artist.id, table.artistsToArtworks.artistId));

	const artworkMap = new Map();

	for (const row of joined) {
		const artwork = row.artwork;
		const artist = row.artist;

		const key = `${artwork.collectionId}-${artwork.artworkId}`;
		if (!artworkMap.has(key)) {
			artworkMap.set(key, { ...artwork, artists: [] });
		}
		if (artist) {
			artworkMap.get(key).artists.push(artist);
		}
	}

	return json(Array.from(artworkMap.values()));
}
