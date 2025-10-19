<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import PaletteBold from 'phosphor-icons-svelte/IconPaletteBold.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		body {
			background-image: url('/assets/45degreee_fabric.png'); /* Background image from Toptal Subtle Textures */
			background-attachment: fixed;
		}
	</style>
</svelte:head>

<nav class="relative bg-slate-800" aria-label="Main navigation">
	<div class="mx-auto flex h-16 items-center justify-between px-2 sm:px-6 lg:px-8">
		<a href="/" class=" inline-flex items-center gap-3 text-2xl text-white"
			><PaletteBold class="h-8 w-auto text-pink-500" />
			<h1 class="hidden md:inline">Musée Imaginaire</h1></a
		>

		<ul class="me-auto ml-6 flex space-x-4">
			<li>
				<Button
					href="/artworks"
					aria-current={page.url.pathname === '/artworks' ? 'true' : undefined}
					class="not-aria-current:text-slate-300 not-aria-current:hover:bg-white/5  aria-current:bg-slate-900"
					>Artworks</Button
				>
			</li>
			<li>
				<Button
					href="/exhibits"
					aria-current={page.url.pathname === '/exhibits' ? 'true' : undefined}
					class="not-aria-current:text-slate-300 not-aria-current:hover:bg-white/5  aria-current:bg-slate-900"
					>Exhibits</Button
				>
			</li>
		</ul>

		<section class="text-slate-200 sm:ml-6" aria-label="User menu">
			{#if data.user}
				<p>
					Hi <a href="/account" class="underline">{data.user.username}</a>!
				</p>
			{:else if page.url.pathname !== '/account/login'}
				<a
					href={'/account/login?redirect=' +
						encodeURIComponent(page.url.pathname + page.url.search)}
					class="underline">Login</a
				>
			{/if}
		</section>
	</div>
</nav>

<main class="mx-5 mb-5 max-w-7xl sm:mx-auto">
	{@render children?.()}
</main>
