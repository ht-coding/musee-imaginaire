import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchExhibits } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params }) => {
	const { username } = params;

	const user = await db
		.select({ username: table.user.username, userId: table.user.id })
		.from(table.user)
		.where(eq(table.user.username, username))
		.limit(1);
	if (!user.length) {
		throw error(404, 'No user with that username found.');
	}
	const exhibits = await fetchExhibits({ userId: user[0].userId });
	return { username: user[0].username, exhibits };
};
