import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import { fetchExhibits } from '$lib/server/utils.js';

export async function GET({ params, url }) {
	const { username } = params;
	const includeEmptyExhibits = url.searchParams.get('includeEmptyExhibits') === 'true';

	const userResult = await db
		.select({ userId: table.user.id })
		.from(table.user)
		.where(eq(table.user.username, username))
		.limit(1);

	const userId = userResult[0]?.userId;

	if (!userId) {
		throw error(404, 'User not found');
	}

	const exhibits = await fetchExhibits({ includeEmptyExhibits, userId });
	return json(exhibits);
}
