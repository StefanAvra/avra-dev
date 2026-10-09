<script lang="ts">
	import { flushSync } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { playSecretSound } from '$lib/actions/beepboop';
	import { handleHotkey, konamiTriggered } from '$lib/actions/hotkeys';
	import { snapshotScramble } from '$lib/actions/scramble';
	import Footer from '$lib/components/Footer.svelte';
	import HotkeyHelp from '$lib/components/HotkeyHelp.svelte';
	import Background from '$lib/components/Background.svelte';
	import '../app.css';
	import Nav from './Nav.svelte';
	import { noteTransition, staggerNoteWords, tagTransition } from '$lib/noteTransition.svelte';

	let { children } = $props();

	onNavigate((navigation) => {
		snapshotScramble();

		if (!document.startViewTransition) return;

		// Name the morphing title's words and tag before the old page is captured.
		const { from, to } = navigation;
		noteTransition.slug =
			to?.route.id === '/notes/[slug]'
				? (to.params?.slug ?? null)
				: from?.route.id === '/notes/[slug]'
					? (from.params?.slug ?? null)
					: null;
		tagTransition.slug =
			to?.route.id === '/notes/tag/[tag]'
				? (to.params?.tag ?? null)
				: from?.route.id === '/notes/tag/[tag]'
					? (from.params?.tag ?? null)
					: null;
		flushSync();

		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			// `ready` rejects when the transition is skipped; nothing to stagger then.
			transition.ready.then(staggerNoteWords, () => {});
		});
	});

	let secretActive = $state(false);
	let isDark = $state(false);

	// How far the page's bottom edge has lifted off the footer, in px. The corner
	// radius follows it (capped in CSS), so a page that fits the viewport stays
	// square until you actually scroll the footer into view.
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let pageHeight = $state(0);
	const revealed = $derived(Math.max(0, scrollY + innerHeight - pageHeight));

	$effect(() => {
		const stored = localStorage.getItem('theme');
		isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
		document.documentElement.classList.toggle('dark', isDark);
	});

	function toggleTheme() {
		isDark = !isDark;
		const theme = isDark ? 'dark' : 'light';
		document.documentElement.style.colorScheme = theme;
		document.documentElement.dataset.theme = theme;
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', theme);
	}

	$effect(() => {
		if ($konamiTriggered) {
			playSecretSound();
			secretActive = true;
			konamiTriggered.set(false);
		}
	});
</script>

<svelte:head>
	<title>Stefan Avramescu</title>
	<link rel="me" href="https://mastodon.social/@Avra" />
	<link rel="alternate" type="application/rss+xml" title="avra.dev" href={resolve('/rss.xml')} />
</svelte:head>

<svelte:window bind:scrollY bind:innerHeight onkeydown={(e) => handleHotkey(e, toggleTheme)} />

<Nav {toggleTheme} {isDark} />
<!-- The page sits above the fixed footer and lifts off it at the end of the scroll. -->
<div
	class="relative z-[1] mb-footer rounded-b-[min(var(--revealed),var(--radius-3xl))] bg-bg transition-colors"
	style:--revealed="{revealed}px"
	bind:offsetHeight={pageHeight}
>
	<main
		class="mx-auto flex min-h-svh max-w-[80ch] flex-col justify-center px-[2ch] pt-[calc(var(--spacing-header)+1lh)] pb-[2lh] sm:px-8"
	>
		{@render children()}
	</main>
</div>

<!-- Above the page so the trace still blends over it. -->
<div class="relative z-[2] mix-blend-darken dark:mix-blend-lighten">
	<Background secret={secretActive} {isDark} ondone={() => (secretActive = false)} />
</div>
<Footer />
<HotkeyHelp />
