<script lang="ts">
	import { keyboardActive, toggleHelp } from '#lib/actions/hotkeys.js';
	import { resolve } from '$app/paths';
	import { version } from '$app/env';
	import { Keyboard, Rss } from '@lucide/svelte';
</script>

<!-- Fixed (not sticky) behind the page so it stays put during overscroll bounce.
     The ::before fill extends it upward, so the rounded corners and any gap the
     bounce opens above it show the footer color rather than the body. -->
<footer
	class="fixed inset-x-0 bottom-0 flex h-footer items-center justify-between gap-[3ch] bg-subtle px-[2ch] text-xs text-muted opacity-100 transition-all before:absolute before:inset-x-0 before:bottom-full before:h-svh before:bg-subtle data-keyboard-active:opacity-100 sm:px-8"
	data-keyboard-active={$keyboardActive || undefined}
>
	<div class="flex items-center gap-[2ch]">
		<a class="no-underline hover:text-accent" href={resolve('privacy')}>imprint &amp; privacy</a>
		<a
			class="transition-colors hover:text-accent"
			href={resolve('rss.xml')}
			data-sveltekit-reload
			aria-label="RSS feed"
		>
			<Rss class="size-[2ch]" strokeWidth={1.5} aria-hidden="true" />
		</a>
		<a
			class="no-underline transition-colors hover:text-accent"
			href="https://github.com/StefanAvra/avra-dev/commit/{version}"
			target="_blank"
			rel="noreferrer"
			aria-label="Deployed commit {version.slice(0, 7)} on GitHub"
			>{version.slice(0, 7)}<br class="sm:hidden" /> <span class="hidden sm:inline"> · </span>
			<time datetime={__COMMIT_DATE__}>{__COMMIT_DATE__}</time></a
		>
	</div>
	<button
		class="hidden cursor-pointer opacity-50 transition-opacity hover:opacity-100 sm:block"
		onclick={() => toggleHelp()}
	>
		<Keyboard class="size-[2ch] hover:text-accent" strokeWidth={1.5} aria-hidden="true" />
	</button>
</footer>
