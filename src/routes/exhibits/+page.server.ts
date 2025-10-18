import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function load() {
	const rows = await db
		.select()
		.from(table.exhibit)
		.innerJoin(table.exhibitToArtworks, eq(table.exhibit.id, table.exhibitToArtworks.exhibitId))
		.innerJoin(
			table.artwork,
			and(
				eq(table.artwork.collectionId, table.exhibitToArtworks.artworkCollectionId),
				eq(table.artwork.artworkId, table.exhibitToArtworks.artworkId)
			)
		)
		.orderBy(table.exhibit.id, table.exhibitToArtworks.addedAt);

	const seen = new Set<number>();
	const filteredExhibits = rows
		.filter((row) => {
			if (seen.has(row.exhibit.id)) return false;
			seen.add(row.exhibit.id);
			return true;
		})
		.map((row) => ({
			id: row.exhibit.id,
			name: row.exhibit.name,
			description: row.exhibit.description,
			createdAt: row.exhibit.createdAt,
			thumbnail: row.artwork.thumbnailURL
		}));

	return {
		exhibits: filteredExhibits
	};
}
