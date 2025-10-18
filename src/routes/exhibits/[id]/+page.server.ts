import type { PageServerLoad } from '../$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fetchExhibits } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params }) => {
	const exhibitId = Number(params.id);
	const exhibit = await fetchExhibits({ includeEmptyExhibits: true, exhibitId });
	const user = await db
		.select({ username: table.user.username })
		.from(table.user)
		.where(eq(table.user.id, exhibit.userId))
		.limit(1);
	return {
		exhibit,
		username: user[0].username
	};
};
