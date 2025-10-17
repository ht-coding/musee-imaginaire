import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	const userId = locals.user?.id;
	const { name, description } = await request.json();

	if (!userId) {
		return new Response(JSON.stringify({ success: false, error: 'Not authenticated' }), {
			status: 401
		});
	}
	try {
		const [newExhibit] = await db
			.insert(table.exhibit)
			.values({
				userId,
				name,
				description
			})
			.returning({ id: table.exhibit.id });

		return new Response(JSON.stringify({ success: true, exhibitId: newExhibit.id }), {
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
			status: 500
		});
	}
};

export async function GET() {
	const exhibits = await db.select().from(table.exhibit);
	return json(exhibits);
}
