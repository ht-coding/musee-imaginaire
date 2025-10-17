import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';

export async function GET({ params }) {
	const { username } = params;

	const userResult = await db
		.select({ userId: table.user.id })
		.from(table.user)
		.where(eq(table.user.username, username))
		.limit(1);

	const userId = userResult[0]?.userId;

	if (!userId) {
		throw error(404, 'User not found');
	}

	const exhibits = await db.select().from(table.exhibit).where(eq(table.exhibit.userId, userId));
	return json(exhibits);
}
