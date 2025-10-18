<script lang="ts">
	import ExhibitList from '$lib/components/ExhibitList.svelte';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
</script>

<article class="mt-5 rounded-2xl bg-white p-5">
	<h2 class="text-2xl" style="text-transform:capitalize">{data.username}'s exhibits</h2>
	<ExhibitList {data} />
</article>
