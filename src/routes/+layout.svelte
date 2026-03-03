<script lang="ts">
  import BlobBackground from '$lib/components/BlobBackground.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<BlobBackground />

<nav>
	<a href="/test">test</a>
	<a href="/blog">blog</a>
</nav>
{@render children()}
