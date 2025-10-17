<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { enhance } from '$app/forms';
</script>

<form method="post" use:enhance>
	<Input type="text" placeholder="Title" name="name" required></Input>
	<Textarea placeholder="Description" name="description" />

	<Button type="submit">Create new exhibit</Button>
</form>
