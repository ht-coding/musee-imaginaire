<script lang="ts">
	import ExhibitList from '$lib/components/ExhibitList.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
</script>

<ExhibitList {data} />
