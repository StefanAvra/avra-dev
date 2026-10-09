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
	import { noteTransition, staggerNoteWords } from '$lib/noteTransition.svelte';

	let { children } = $props();

	onNavigate((navigation) => {
		snapshotScramble();

		if (!document.startViewTransition) return;

		// Name the morphing title's words before the old page is captured.
		const { from, to } = navigation;
		noteTransition.slug =
			to?.route.id === '/notes/[slug]'
				? (to.params?.slug ?? null)
				: from?.route.id === '/notes/[slug]'
					? (from.params?.slug ?? null)
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

<svelte:window onkeydown={(e) => handleHotkey(e, toggleTheme)} />

<Nav {toggleTheme} {isDark} />
<main
	class="mx-auto flex min-h-svh max-w-[80ch] flex-col justify-center bg-bg px-[2ch] pt-[calc(var(--spacing-header)+1lh)] pb-[2lh] transition-colors sm:px-8"
>
	{@render children()}
</main>

<div class="mix-blend-darken dark:mix-blend-lighten">
	<Background secret={secretActive} {isDark} ondone={() => (secretActive = false)} />
</div>
<Footer />
<HotkeyHelp />
