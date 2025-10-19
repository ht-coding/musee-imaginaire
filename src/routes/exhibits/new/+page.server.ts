import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/account/login');
	}
};
export const actions = {
	default: async ({ request, locals }) => {
		try {
			const data = await request.formData();
			const name = data.get('name');
			const description = data.get('description');

			if (typeof name !== 'string' || name.trim() === '') {
				return fail(400, { message: 'Name is required' });
			}

			await db.insert(table.exhibit).values({
				userId: locals.user.id,
				name,
				description: typeof description === 'string' ? description : null
			});
		} catch (error) {
			console.error('Action error:', error);
			return fail(500, { message: 'Server error' });
		}

		return redirect(303, '/account');
	}
};
