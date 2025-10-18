<script lang="ts">
	import ExhibitList from '$lib/components/ExhibitList.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
</script>

<Button href="/exhibits/new" class="mt-5">Create your own exhibit</Button>
<ExhibitList {data} title="User's Exhibits" />
