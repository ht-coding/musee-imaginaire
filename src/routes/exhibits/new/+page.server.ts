import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const { locals } = getRequestEvent();
		if (!locals.user) return;
		const data = await request.formData();
		const name = data.get('name');
		const description = data.get('description');

		if (typeof name !== 'string' || name.length === 0) {
			return fail(400, { message: 'Name is required' });
		}
		try {
			await db.insert(table.exhibit).values({
				userId: locals.user.id,
				name,
				description: typeof description === 'string' ? description : null
			});

			return { success: true };
		} catch (error) {
			return fail(500, { message: (error as Error).message });
		}
	}
};
