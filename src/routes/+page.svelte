<script lang="ts">
	import { goto } from '$app/navigation';
	import Searchbar from '$lib/components/Searchbar.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Autoplay from 'embla-carousel-autoplay';
	let inputValue = $state('');
	const { data } = $props();
</script>

<form
	class="mt-5 flex w-full items-center justify-center space-x-2"
	onsubmit={(event) => {
		event.preventDefault();
		goto('/artworks');
	}}
>
	<Searchbar bind:inputValue />
</form>

<Carousel.Root
	opts={{
		align: 'center',
		loop: true
	}}
	plugins={[
		Autoplay({
			delay: 4000
		})
	]}
	class="mx-auto mt-5 w-full max-w-4xl overflow-clip rounded-t-2xl"
>
	<Carousel.Content>
		{#each data.artworks as artwork, i (i)}
			<Carousel.Item class="basis-1/3 sm:basis-1/4 md:basis-1/6">
				<img src={artwork.thumbnailURL} class="h-full w-full object-cover" alt="" />
			</Carousel.Item>
		{/each}
	</Carousel.Content>
</Carousel.Root>

<article class="m-auto max-w-4xl rounded-b-2xl bg-white p-5 text-center">
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
