<script lang="ts">
	import { onMount } from 'svelte';

	let circles = $state([
		{ cx: 888, cy: 34 },
		{ cx: 679, cy: 224 },
		{ cx: 184, cy: 461 },
		{ cx: 336, cy: 591 },
		{ cx: 194, cy: 204 },
		{ cx: 390, cy: 358 }
	]);

	onMount(() => {
		circles = circles.map(() => ({
			cx: Math.floor(Math.random() * 900),
			cy: Math.floor(Math.random() * 600)
		}));
	});
</script>

<div class="bg-container pointer-events-none">
	<svg viewBox="0 0 900 600" width="900" height="600" class="bg-svg">
		<g>
			{#each circles as { cx, cy }, i}
				<circle
					class="blob blob-{i + 1}"
					{cx}
					{cy}
					fill="currentColor"
					r="357"
				></circle>
			{/each}
		</g>
	</svg>
</div>
