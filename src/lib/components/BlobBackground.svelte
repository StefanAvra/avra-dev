<script lang="ts">
	const circles = $derived(
		Array.from({length: 6}, () => ({
			cx: Math.floor(Math.random() *  900),
			cy: Math.floor(Math.random() *  600)
		}),
		)
	)
</script>

<div class="absolute inset-0 blur-[100px] transform-gpu pointer-events-none">
	<svg viewBox="0 0 900 600" width="900" height="600" class="w-full h-full absolute">
		<g>
			{#each circles as { cx, cy }, i (i)}
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
