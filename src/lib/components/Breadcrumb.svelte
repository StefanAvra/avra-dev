<script lang="ts">
	import { scramble } from '$lib/actions/scramble';
	import { page } from '$app/state';
</script>

{#key page.url.pathname}
	<span class="text-sm text-muted" use:scramble>~{page.url.pathname}</span>
{/key}
