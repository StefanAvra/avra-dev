<script lang="ts">
	import { page } from '$app/state';

	const isListPage = $derived(page.url.pathname === '/notes' || page.url.pathname === '/notes/');
</script>

<div
	class="fixed inset-x-0 bottom-0 z-10 hidden items-center justify-center gap-[3ch] border-t border-border bg-bg px-[2ch] py-1 text-sm text-muted sm:flex"
>
	<span><kbd class="text-accent">[h]</kbd> home</span>
	<span><kbd class="text-accent">[n]</kbd> notes</span>
	<span><kbd class="text-accent">[t]</kbd> theme</span>
	{#if isListPage}
		<span><kbd class="text-accent">[j/k]</kbd> navigate</span>
		<span><kbd class="text-accent">[⏎]</kbd> open</span>
	{/if}
	<span><kbd class="text-accent">[?]</kbd> help</span>
</div>
