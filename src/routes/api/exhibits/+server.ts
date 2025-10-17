import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export async function GET() {
	const exhibits = await db.select().from(table.exhibit);
	return json(exhibits);
}
