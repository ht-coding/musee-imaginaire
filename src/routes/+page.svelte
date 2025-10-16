<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import IconMagnifyingGlassBold from 'phosphor-icons-svelte/IconMagnifyingGlassBold.svelte';
	import MiniMasonry from 'minimasonry';

	let artworksPromise: Promise<any>;
	if (browser) artworksPromise = fetch('/api/artworks').then((response) => response.json());

	const elementAttach = (container: HTMLElement) => {
		const masonry = new MiniMasonry({
			container
		});
	};

	function handleLoad(event: Event) {
		event.target.parentElement.classList.remove('loading');
	}
</script>

<article class="mx-auto mb-5 max-w-prose text-center">
	<h1 class="py-5 text-4xl">Your Musée Imaginaire</h1>

	<blockquote
		class="text-xl italic"
		cite="https://www.universalis.fr/encyclopedie/musee-imaginaire/"
	>
		"Only imagination is capable of spanning the passage of time and space to assemble the
		impossible."
		<footer class="text-sm not-italic">
			— <cite>Encyclopédie Universalis</cite> (self translation)
		</footer>
	</blockquote>
	<p class="py-3">
		<dfb><strong>mu·​sée ima·​gi·​naire</strong></dfb>—"Museum of the imagination", a concept from
		the writings of the French author and Minister of Culture André Malraux, in the first volume of
		his work
		<i>La Psychologie de l'art</i>.
	</p>
	<p>
		Browse the paintings gathered here from multiple real life museums, and create your perfect
		collection!
	</p>
</article>

<form class="flex w-full items-center justify-center space-x-2">
	<!--TODO: implement fuzzy search for artworks -->
	<Input type="text" placeholder="Search" class=" max-w-sm" />
	<Button type="submit">
		<IconMagnifyingGlassBold />
	</Button>
</form>
{#if artworksPromise}
	{#await artworksPromise}
		<p>Loading...</p>
	{:then artworks}
		<div class="relative mt-5 columns-4 px-5" style="height:400px" {@attach elementAttach}>
			{#each artworks.slice(0, 24) as art}
				<!--TODO: Pagination -->
				<figure
					class="visible absolute mb-5 break-inside-avoid opacity-100 transition-all"
					style="--width:{art.width};--height:{art.height};"
				>
					<a href="/artwork/{art.collectionId}-{art.artworkId}" class="transition hover:opacity-90">
						<div class="img-container loading h-full w-full shadow-sm/50">
							<img
								src={art.thumbnailURL}
								alt={art.alt}
								class="h-full w-full"
								on:load={handleLoad}
							/>
						</div>
					</a>
				</figure>
			{/each}
		</div>
	{:catch error}
		<p>Error loading artworks: {error.message}</p>
	{/await}
{/if}

<style>
	@keyframes spin {
		100% {
			transform: rotate(1turn);
		}
	}
	.img-container {
		aspect-ratio: var(--width) / var(--height);
		background: #eee;
		border-color: #75553e;
		border-style: inset inset outset outset;
		border-width: 0.75em;
	}
	.loading {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		&.img-container {
			&::after {
				content: '';
				background-image: url('/assets/circle-notch.svg');
				background-size: contain;
				background-repeat: no-repeat;
				width: 3rem;
				height: 3rem;
				display: block;
				z-index: 2;
				position: absolute;
				animation: spin 1s linear infinite;
			}
		}
	}
</style>
