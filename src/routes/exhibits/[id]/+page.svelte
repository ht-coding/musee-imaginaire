<script lang="ts">
	import Gallery from '$lib/components/Gallery.svelte';

	const { data } = $props();
</script>

<article class="mx-auto mt-5 mb-3 max-w-2xl rounded-2xl bg-white p-5">
	{#if data.exhibit}
		<h2 class="text-center text-3xl">{data.exhibit.name}</h2>
		<h3 class="text-center text-slate-500">
			An exhibit by <a href="/user/{data.username}" class="underline">{data.username}</a>
		</h3>
		<p>{data.exhibit.description}</p>
	{:else}
		No Exhibit found with that ID
	{/if}
</article>
{#if data.exhibit.artworks.length > 0}
	<Gallery artworks={data.exhibit.artworks} />
{/if}
