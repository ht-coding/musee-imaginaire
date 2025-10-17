import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const user = requireLogin();
	const response = await fetch(`/api/users/${user.username}/exhibits`);

	if (!response.ok) {
		throw new Error(`Failed to fetch exhibits for ${user.username}: ${response.status}`);
	}

	const exhibits = await response.json();

	return {
		user,
		exhibits
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/account/login');
	}

	return locals.user;
}
