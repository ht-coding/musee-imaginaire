<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import IconMagnifyingGlassBold from 'phosphor-icons-svelte/IconMagnifyingGlassBold.svelte';
	// export let data;
</script>

<h1 class="py-5 text-center text-2xl">Welcome to Launchpad Museum</h1>

<form class="flex w-full items-center justify-center space-x-2">
	<Input type="text" placeholder="Search" class=" max-w-sm" />
	<Button type="submit">
		<IconMagnifyingGlassBold />
	</Button>
</form>
