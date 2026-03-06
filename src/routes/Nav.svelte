<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const { toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean } = $props();
</script>

<nav>
	<div class="nav-links">
		<a href={resolve('/')} aria-current={page.url.pathname === '/' ? 'page' : undefined}>[home]</a>
		<a
			href={resolve('/notes')}
			aria-current={page.url.pathname.startsWith('/notes') ? 'page' : undefined}>[notes]</a
		>
		<!-- 
    this not yet available
    <a
			href={resolve('/projects')}
			aria-current={page.url.pathname.startsWith('/projects') ? 'page' : undefined}>[projects]</a
		> -->
	</div>
	<button onclick={toggleTheme}>{isDark ? '[light]' : '[dark]'}</button>
</nav>

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
