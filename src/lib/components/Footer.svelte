<script lang="ts">
	import { keyboardActive, toggleHelp } from '$lib/actions/hotkeys';
	import { resolve } from '$app/paths';
</script>

<!-- Fixed (not sticky) behind the page so it stays put during overscroll bounce.
     The ::before fill extends it upward, so the rounded corners and any gap the
     bounce opens above it show the footer color rather than the body. -->
<footer
	class="fixed inset-x-0 bottom-0 flex h-footer items-center justify-between gap-[3ch] bg-subtle px-[2ch] text-sm text-muted opacity-100 transition-all before:absolute before:inset-x-0 before:bottom-full before:h-svh before:bg-subtle data-keyboard-active:opacity-100 sm:px-8"
	data-keyboard-active={$keyboardActive || undefined}
>
	<div class="flex gap-[2ch]">
		<a class="bracketed no-underline" href={resolve('/privacy')}>imprint &amp; privacy</a>
		<a class="bracketed no-underline" href={resolve('/rss.xml')} data-sveltekit-reload>rss</a>
	</div>
	<button
		class="cursor-pointer opacity-50 transition-opacity hover:opacity-100"
		onclick={() => toggleHelp()}
	>
		<kbd class="text-accent">[?]</kbd> help</button
	>
</footer>
