import { refreshApi } from '$lib/server/utils';
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		await refreshApi();
		return json({ success: true });
	} catch (error) {
		console.error('Failed to refresh API:', error);
		return json({ success: false, error: 'Failed to refresh data.' }, { status: 500 });
	}
}
