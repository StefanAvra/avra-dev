<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { scrambleAllOut } from '$lib/actions/scramble';
	import '../app.css';
	import Nav from './Nav.svelte';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) {
			scrambleAllOut().then(() => navigation.complete);
			return;
		}

		return new Promise((resolve) => {
			scrambleAllOut().then(() => {
				document.startViewTransition(async () => {
					resolve();
					await navigation.complete;
					window.dispatchEvent(new CustomEvent('scramble'));
				});
			});
		});
	});

	let isDark = $state(false);

	$effect(() => {
		const stored = localStorage.getItem('theme');
		isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	function toggleTheme() {
		isDark = !isDark;
		const theme = isDark ? 'dark' : 'light';
		document.documentElement.style.colorScheme = theme;
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('theme', theme);
	}
</script>

<Nav {toggleTheme} {isDark} />

{@render children()}
