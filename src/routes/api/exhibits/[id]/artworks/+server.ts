import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { exhibitToArtworks } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const { exhibitId, artworkCollectionId, artworkId } = await request.json();
	if (!exhibitId || !artworkId || !artworkCollectionId) {
		return new Response(JSON.stringify({ success: false, error: 'Missing data' }), {
			status: 400
		});
	}
	try {
		await db.insert(exhibitToArtworks).values({
			exhibitId,
			artworkCollectionId,
			artworkId,
			addedAt: new Date()
		});

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
			status: 400
		});
	}
};
