import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';

export async function GET({ params }) {
	const { username } = params;

	const user = await db.select().from(table.user).where(eq(table.user.username, username)).limit(1);

	if (!user.length) {
		throw error(404, 'User not found');
	}

	return json(user);
}
