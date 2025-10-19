<script lang="ts">
	import { enhance } from '$app/forms';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { type Exhibit } from '$lib/server/db/schema.js';
	const { data, form } = $props();
	let value = $state('');

	const triggerContent = $derived(
		data.exhibits.find((exhibit: Exhibit) => exhibit.id === Number(value))?.name ??
			'Select an exhibit'
	);
</script>

<div class="mx-auto my-5 w-3xl max-w-full">
	<Artwork art={data.artwork} />
</div>
<article class="rounded-2xl bg-white p-5">
	<h2 class="text-2xl">
		{data.artwork.title}
	</h2>
	<dl class="my-3 grid gap-x-5 gap-y-3 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto_1fr]">
		<dt>Collection</dt>
		<dl>{data.artwork.collection}</dl>
		<dt>People</dt>
		<dl>
			{#each data.artwork.artists as artist, i}{#if i !== 0}&
				{/if}{artist.name} ({artist.culture}, {artist.years})
			{/each}
		</dl>
		<dt>Medium</dt>
		<dl>{data.artwork.medium}</dl>
		<dt>Credit Line</dt>
		<dl>{data.artwork.creditLine}</dl>
		<dt>Accession Year</dt>
		<dl>{data.artwork.accessionYear}</dl>
	</dl>
	<p>
		{#if data.artwork.description === 'Visit the Met website to learn more.' || data.artwork.description === 'Visit the Harvard Art Museums website for more information'}
			<a href={data.artwork.artworkURL} class="underline">{data.artwork.description}</a>
		{:else}
			{data.artwork.description}
			<a href={data.artwork.artworkURL} class="underline"
				>Click here to learn more on the {data.artwork.collection} website.</a
			>
		{/if}
	</p>
	{#if data.user}
		{#if data.exhibits.length > 0}
			<form method="post" class="flex justify-center" action="?/addToExhibit" use:enhance>
				<input type="hidden" value={data.artwork.collectionId} name="collectionId" />
				<input type="hidden" value={data.artwork.artworkId} name="artworkId" />
				<Field.Set
					><Field.Group>
						<Field.Field orientation="horizontal">
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
							<Button type="submit" disabled={!value}>Add</Button>
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</form>
			<p style="color: red">{form?.message ?? ''}</p>
		{:else}
			<p class="mt-5 text-center">
				If you <a href="/exhibits/new" class="underline">create an exhibit</a>, you can add artworks
				like this one to it!
			</p>
		{/if}
	{/if}
</article>

<style></style>
