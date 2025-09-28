<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Login/Register</h1>
<form method="post" action="?/login" use:enhance>
	<Input name="username" placeholder="Username" class="mt-1 inline max-w-xs" />
	<Input type="password" name="password" placeholder="password" class="mt-1  inline max-w-xs" />
	<Button type="submit">Login</Button>
	<Button type="submit" formaction="?/register">Register</Button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
