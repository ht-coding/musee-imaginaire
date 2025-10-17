<script lang="ts">
	import Gallery from '$lib/components/Gallery.svelte';

	const { data } = $props();
</script>

{#if data.exhibit}
	<h1 class="text-3xl">{data.exhibit.name}</h1>
	<p>
		{data.exhibit.description}
	</p>
	<Gallery artworks={data.artworks} />
{:else}
	No Exhibit found with that ID
{/if}
