<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import PaletteBold from 'phosphor-icons-svelte/IconPaletteBold.svelte';

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
		<a href="/"><PaletteBold class="h-8 w-auto text-pink-500" /></a>

		<menu class="me-auto hidden space-x-4 sm:ml-6 sm:flex">
			<li role="none">
				<a
					href="/artworks"
					role="menuitem"
					aria-current={page.url.pathname === '/artworks' ? 'page' : undefined}
					class={page.url.pathname === '/artworks'
						? 'rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white'
						: 'rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white'}
					>Artworks</a
				>
			</li>
			<li role="none">
				<a
					href="/exhibits"
					role="menuitem"
					class="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
					>Exhibits</a
				>
			</li>
		</menu>

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

<main class="m-auto flex h-100 max-w-7xl flex-col">
	{@render children?.()}
</main>
