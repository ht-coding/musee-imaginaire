import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { isApiStale, refreshApi } from '$lib/server/utils';
import { json } from '@sveltejs/kit';

export async function GET() {
	const updateData = await isApiStale();

	if (updateData) {
		console.log('refreshing');
		await refreshApi();
	}

	const artworks = await db.select().from(table.artworks);
	return json(artworks);
}
