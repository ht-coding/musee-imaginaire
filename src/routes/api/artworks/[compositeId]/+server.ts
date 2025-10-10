import { db } from '$lib/server/db';
import { artworks } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';

export async function GET({ params }) {
	const { compositeId } = params;

	const parts = compositeId.split('-');

	if (parts.length !== 2) {
		throw error(
			400,
			'Invalid artwork ID format. Expected format: collectionId-artworkId (e.g. "met-123").'
		);
	}

	const [collectionIdRaw, artworkIdRaw] = parts;
	const artworkId = Number(artworkIdRaw);
	const collectionId = capitalizeFirst(collectionIdRaw);

	const validCollections = ['Met', 'Harvard'];

	if (!validCollections.includes(collectionId)) {
		throw error(
			400,
			`Invalid collection ID "${collectionId}". Valid options are: ${validCollections.join(', ')}. Expected format: collectionId-artworkId (e.g. "met-123").`
		);
	}
	if (isNaN(artworkId)) {
		throw error(
			400,
			'Artwork ID must be a number. Expected format: collectionId-artworkId (e.g. "met-123").'
		);
	}

	const result = await db
		.select()
		.from(artworks)
		.where(and(eq(artworks.collectionId, collectionId), eq(artworks.artworkId, artworkId)))
		.limit(1);

	if (!result.length) {
		throw error(404, 'Artwork not found');
	}

	return json(result[0]);
}

function capitalizeFirst(str: string) {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
