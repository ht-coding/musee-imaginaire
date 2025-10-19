<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import ExhibitList from '$lib/components/ExhibitList.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="my-5 text-center">
	<ExhibitList {data} title="Your Exhibits" />
</div>
<form class="text-center" method="post" action="?/logout" use:enhance>
	<Button href="/exhibits/new">Create a new exhibit</Button>
	<Button type="submit">Sign out</Button>
</form>
