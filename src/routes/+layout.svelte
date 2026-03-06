<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { scrambleAllOut } from '$lib/actions/scramble';
	import '../app.css';

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

<nav>
	<div class="nav-links">
		<a
			href={resolve('/')}
			aria-current={page.url.pathname === '/' ? 'page' : undefined}>[home]</a
		>
		<a
			href={resolve('/notes')}
			aria-current={page.url.pathname.startsWith('/notes') ? 'page' : undefined}>[notes]</a
		>
		<a
			href={resolve('/projects')}
			aria-current={page.url.pathname.startsWith('/projects') ? 'page' : undefined}>[projects]</a
		>
	</div>
	<button onclick={toggleTheme}>{isDark ? '[light]' : '[dark]'}</button>
</nav>

{@render children()}

<style>
	nav {
		view-transition-name: nav;
		border-bottom: 1px solid var(--border);
		padding: 1lh 2ch;
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 80ch;
		margin: 0 auto;
	}

	.nav-links {
		display: flex;
		gap: 2ch;
	}

	nav a {
		text-decoration: none;
		position: relative;
	}

	nav a[aria-current='page']::before {
		content: '>';
		position: absolute;
		translate: -1ch 0;
		view-transition-name: active-page-indicator;
	}

	button {
		background: none;
		border: none;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		color: var(--fg);
	}
</style>
