<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageServerData } = $props();
</script>

<p>Your user ID is {data.user.id}.</p>
<form method="post" action="?/logout" use:enhance>
	<Button type="submit">Sign out</Button>
</form>
