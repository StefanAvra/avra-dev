<script lang="ts">
	import { scramble } from '$lib/actions/scramble';

	let { path }: { path: string } = $props();
</script>

<p class="fg-muted" use:scramble>{path}</p>
