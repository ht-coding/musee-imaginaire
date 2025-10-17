<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import ExhibitList from '$lib/components/ExhibitList.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<form method="post" action="?/logout" use:enhance>
	<Button type="submit">Sign out</Button>
</form>

<ExhibitList {data} />
