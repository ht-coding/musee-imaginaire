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

		if (typeof name !== 'string') {
			return fail(400, { error: 'Name is required' });
		}
		try {
			const [newExhibit] = await db
				.insert(table.exhibit)
				.values({
					userId: locals.user.id,
					name,
					description: typeof description === 'string' ? description : null
				})
				.returning({ id: table.exhibit.id });

			return { success: true };
		} catch (error) {
			return fail(500, { error: (error as Error).message });
		}
	}
};
