import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export async function load() {
	const artworks = await db
		.select()
		.from(table.artwork)
		.orderBy(sql`RANDOM()`)
		.limit(12);

	return {
		artworks
	};
}
