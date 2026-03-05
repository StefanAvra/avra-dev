<script lang="ts">
	import { onNavigate } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import BlobBackground from '$lib/components/BlobBackground.svelte';
	import '../app.css';

	let { children } = $props();

	onNavigate((navigation) => {
		if(!document.startViewTransition) return;

		return new Promise((resolve) => {document.startViewTransition(async () => {
			resolve();
			await navigation.complete
		})})
	})

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

<BlobBackground />

<nav class="flex justify-center gap-8 p-4">
	<a href={resolve('/')} class="aria-[current=page]:font-bold" aria-current={page.url.pathname === '/' ? 'page' : undefined}>home</a>
	<a href={resolve('/notes')} class="aria-[current=page]:font-bold" aria-current={page.url.pathname.startsWith('/notes') ? 'page' : undefined}>notes</a>
	<button onclick={toggleTheme} aria-label="Toggle theme">{isDark ? '☀' : '☼'}</button>
</nav>

{@render children()}

<style>
	nav {
		view-transition-name: nav;
	}
	nav > a[aria-current='page']::before {
		content:'>';
		position: absolute;
		translate:-1ch 0;
		view-transition-name: active-page-indicator;
	}
</style>
