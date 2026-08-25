<script lang="ts">
	import { keyboardActive, toggleHelp } from '$lib/actions/hotkeys';
	import { resolve } from '$app/paths';
</script>

<footer
	class="flex items-center justify-between gap-[3ch] border-t-[0.5px] border-border bg-bg/50 px-[2ch] py-1 text-sm text-muted opacity-100 backdrop-blur-3xl transition-all data-keyboard-active:opacity-100 sm:px-8"
	data-keyboard-active={$keyboardActive || undefined}
>
	<a class="bracketed no-underline" href={resolve('/privacy')}>privacy policy</a>
	<button
		class="cursor-pointer opacity-50 transition-opacity hover:opacity-100"
		onclick={() => toggleHelp()}
	>
		<kbd class="text-accent">[?]</kbd> help</button
	>
</footer>
