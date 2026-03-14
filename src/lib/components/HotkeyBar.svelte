<script lang="ts">
	import { page } from '$app/state';
	import { keyboardActive } from '$lib/actions/hotkeys';

	const isListPage = $derived(page.url.pathname === '/notes' || page.url.pathname === '/notes/');
</script>

<div
	class="fixed inset-x-0 bottom-0 z-10 hidden items-center justify-center gap-[3ch] border-t border-border bg-bg px-[2ch] py-1 text-sm text-muted opacity-0 transition-opacity hover:opacity-100 data-keyboard-active:opacity-100 sm:flex"
	data-keyboard-active={$keyboardActive || undefined}
>
	<span
		class="opacity-15 transition-opacity hover:opacity-100 data-keyboard-active:opacity-50"
		data-keyboard-active={$keyboardActive || undefined}
		><kbd class="text-accent">[h]</kbd> home</span
	>
	<span
		class="opacity-15 transition-opacity hover:opacity-100 data-keyboard-active:opacity-50"
		data-keyboard-active={$keyboardActive || undefined}
		><kbd class="text-accent">[n]</kbd> notes</span
	>
	<span
		class="opacity-15 transition-opacity hover:opacity-100 data-keyboard-active:opacity-50"
		data-keyboard-active={$keyboardActive || undefined}
		><kbd class="text-accent">[t]</kbd> theme</span
	>
	{#if isListPage}
		<span
			class="opacity-15 transition-opacity hover:opacity-100 data-keyboard-active:opacity-50"
			data-keyboard-active={$keyboardActive || undefined}
			><kbd class="text-accent">[j/k]</kbd> navigate</span
		>
		<span
			class="opacity-15 transition-opacity hover:opacity-100 data-keyboard-active:opacity-50"
			data-keyboard-active={$keyboardActive || undefined}
			><kbd class="text-accent">[⏎]</kbd> open</span
		>
	{/if}
	<span class="opacity-50 transition-opacity hover:opacity-100"
		><kbd class="text-accent">[?]</kbd> help</span
	>
</div>
