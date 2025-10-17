<script lang="ts">
	import Gallery from '$lib/components/Gallery.svelte';

	const { data } = $props();
</script>

{#if data.exhibit}
	{data.exhibit.name}
	{data.exhibit.description}
	<Gallery artworks={data.artworks} />
{:else}
	No Exhibit found with that ID
{/if}
