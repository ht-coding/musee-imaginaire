<script lang="ts">
	import { enhance } from '$app/forms';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Exhibit } from '$lib/server/db/schema.js';
	const { data, form } = $props();
	let value = $state('');

	const triggerContent = $derived(
		data.exhibits.find((exhibit: Exhibit) => exhibit.id === Number(value))?.name ??
			'Select an exhibit'
	);
</script>

<div class="mx-auto w-3xl">
	<Artwork art={data.artwork} />
	<p class="text-sm text-gray-500">{data.artwork.creditLine}</p>
</div>
<h2 class="text-2xl">
	{data.artwork.title} :: {#each data.artwork.artists as artist, i}
		{#if i !== 0}&
		{/if}{artist.name}
	{/each}
</h2>
{#if data.exhibits.length > 0}
	<form method="post" action="?/addToExhibit" use:enhance>
		<input type="hidden" value={data.artwork.collectionId} name="collectionId" />
		<input type="hidden" value={data.artwork.artworkId} name="artworkId" />
		<Select.Root type="single" name="exhibitToAddTo" bind:value>
			<Select.Trigger class="w-[180px]">
				{triggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Your Exhibits</Select.Label>
					{#each data.exhibits as exhibit (exhibit.name)}
						<Select.Item value={exhibit.id} label={exhibit.name}>
							{exhibit.name}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<Button type="submit">Add</Button>
		<p style="color: red">{form?.message ?? ''}</p>
	</form>
{/if}
<p>{data.artwork.description}</p>
<p>
	<a href={data.artwork.artworkURL} class="text-blue-600 hover:underline"
		>Click here to view on the {data.artwork.collection} website.</a
	>
	:: <a href="/" class="text-blue-600 hover:underline">Return to homepage</a>
</p>
