<script lang="ts">
	import IconMagnifyingGlassBold from 'phosphor-icons-svelte/IconMagnifyingGlassBold.svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';

	let { inputValue = $bindable() } = $props();
</script>

<Input
	type="text"
	placeholder="Begin typing..."
	class="h-12 max-w-md !text-2xl"
	bind:value={inputValue}
/>
<Button type="submit" size="lg" class="!m-0 !px-5 py-6 !text-lg">
	<IconMagnifyingGlassBold /> Search
</Button>
