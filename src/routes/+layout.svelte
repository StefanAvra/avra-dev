<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { playSecretSound } from '$lib/actions/beepboop';
	import { handleHotkey, konamiTriggered } from '$lib/actions/hotkeys';
	import { snapshotScramble } from '$lib/actions/scramble';
	import HotkeyBar from '$lib/components/HotkeyBar.svelte';
	import HotkeyHelp from '$lib/components/HotkeyHelp.svelte';
	import SecretBackground from '$lib/components/SecretBackground.svelte';
	import '../app.css';
	import Nav from './Nav.svelte';

	let { children } = $props();

	onNavigate((navigation) => {
		snapshotScramble();

		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
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
</svelte:head>

<svelte:window onkeydown={(e) => handleHotkey(e, toggleTheme)} />

<Nav {toggleTheme} {isDark} />
<main
	class="mx-auto flex min-h-svh max-w-[80ch] flex-col justify-center bg-bg px-[2ch] pt-[calc(var(--spacing-header)+1lh)] pb-[2lh] sm:px-8"
>
	{@render children()}
</main>
{#if secretActive}
	<div class="mix-blend-darken dark:mix-blend-lighten">
		<SecretBackground ondone={() => (secretActive = false)} />
	</div>
{/if}
<HotkeyBar />
<HotkeyHelp />
