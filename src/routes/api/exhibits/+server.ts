import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { exhibit } from '$lib/server/db/schema';

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
			.insert(exhibit)
			.values({
				userId,
				name,
				description
			})
			.returning({ id: exhibit.id });

		return new Response(JSON.stringify({ success: true, exhibitId: newExhibit.id }), {
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
			status: 500
		});
	}
};
