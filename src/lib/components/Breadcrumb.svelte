<script lang="ts">
	import { scramble } from '#lib/actions/scramble.js';
	import { page } from '$app/state';
</script>

{#key page.url.pathname}
	<span class="text-sm text-muted" use:scramble>~{page.url.pathname}</span>
{/key}
