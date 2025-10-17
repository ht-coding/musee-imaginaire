import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export async function load() {
	const exhibits = await db.select().from(table.exhibit);

	return {
		exhibits
	};
}
