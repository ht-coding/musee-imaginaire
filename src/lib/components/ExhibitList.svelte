<script lang="ts">
	import Button from './ui/button/button.svelte';

	const { data, title } = $props();
</script>

{#if data.exhibits.length === 0}
	<p>
		No exhibits! {#if data.user}
			<a href="/exhibits/new" class="underline">Create one?</a>
		{/if}
	</p>
{:else}
	<div
		class="mt-5 mb-3 grid grid-cols-2 gap-2 rounded-2xl bg-white p-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
	>
		<h2 class="col-span-full text-center text-3xl">{title}</h2>
		{#each data.exhibits as exhibit}
			<a href={`/exhibits/${exhibit.id}`} class="underline transition hover:opacity-90">
				<figure>
					<img
						src={exhibit.thumbnail ?? 'https://placehold.co/400/eee/eee'}
						alt="thumbnail"
						class="aspect-square w-3xs object-cover"
					/>
					<figcaption>
						{exhibit.name}
					</figcaption>
				</figure>
			</a>
		{/each}
	</div>
{/if}
