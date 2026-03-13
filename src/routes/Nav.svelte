<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const { toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean } = $props();
</script>

<nav
	class="fixed inset-x-0 z-10 flex h-header items-center justify-between border-b border-border bg-bg px-[2ch] [view-transition-name:nav] sm:px-8"
>
	<div class="flex gap-[2ch]">
		<a
			class="bracketed relative no-underline"
			href={resolve('/')}
			aria-current={page.url.pathname === '/' ? 'page' : undefined}>home</a
		>
		<a
			class="bracketed relative no-underline"
			href={resolve('/notes')}
			aria-current={page.url.pathname.startsWith('/notes') ? 'page' : undefined}>notes</a
		>
		<!--
    this not yet available
    <a
			class="bracketed relative no-underline"
			href={resolve('/projects')}
			aria-current={page.url.pathname.startsWith('/projects') ? 'page' : undefined}>projects</a
		> -->
	</div>
	<button
		class="bracketed cursor-pointer border-0 bg-transparent p-0 text-fg [font:inherit]"
		onclick={toggleTheme}>{isDark ? 'light' : 'dark'}</button
	>
	<div class="absolute bottom-0 translate-y-1/2 bg-bg px-[1ch] leading-1">
		<Breadcrumb />
	</div>
</nav>
