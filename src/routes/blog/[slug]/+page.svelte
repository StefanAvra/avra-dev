<script lang="ts">
	import type { Component } from 'svelte';

	let { data } = $props();
	let Content = $derived(data.content as unknown as Component);
</script>

<main>
	<div class="card">
		<h1>{data.title}</h1>
		<p class="text-smaller">{data.date}</p>
		<Content />
	</div>
</main>
