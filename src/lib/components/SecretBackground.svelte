<script lang="ts">
	const BLOCKS = ['█', '▓', '▒'];
	const FONT_SIZE = 16;
	const RING_WIDTH = 80;
	const SPEED = 600;

	let { ondone }: { ondone: () => void } = $props();

	let canvas: HTMLCanvasElement;
	let colorProbe: HTMLSpanElement;

	$effect(() => {
		const ctx = canvas.getContext('2d')!;
		const dpr = window.devicePixelRatio || 1;
		const w = window.innerWidth;
		const h = window.innerHeight;

		canvas.width = w * dpr;
		canvas.height = h * dpr;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		ctx.scale(dpr, dpr);

		ctx.font = `${FONT_SIZE}px monospace`;
		const color = getComputedStyle(colorProbe).color;
		ctx.textBaseline = 'top';

		const charWidth = ctx.measureText('█').width;
		const cols = Math.ceil(w / charWidth) + 1;
		const rows = Math.ceil(h / FONT_SIZE) + 1;

		const cx = w / 2;
		const cy = h / 2;
		const maxRadius = Math.sqrt(Math.max(cx, w - cx) ** 2 + Math.max(cy, h - cy) ** 2) + RING_WIDTH;

		let raf: number;
		let start: number | null = null;

		function frame(t: number) {
			if (start === null) start = t;
			const elapsed = t - start;
			const radius = (elapsed / 1000) * SPEED;

			if (radius > maxRadius) {
				ondone();
				return;
			}

			ctx.clearRect(0, 0, w * dpr, h * dpr);
			ctx.fillStyle = color;

			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const px = c * charWidth + charWidth / 2;
					const py = r * FONT_SIZE + FONT_SIZE / 2;
					const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
					const delta = Math.abs(dist - radius);

					if (delta < RING_WIDTH) {
						const normalized = delta / RING_WIDTH;
						const idx = normalized < 0.33 ? 0 : normalized < 0.66 ? 1 : 2;
						ctx.fillText(BLOCKS[idx], c * charWidth, r * FONT_SIZE);
					}
				}
			}

			raf = requestAnimationFrame(frame);
		}

		raf = requestAnimationFrame(frame);

		return () => cancelAnimationFrame(raf);
	});
</script>

<span bind:this={colorProbe} class="hidden text-accent"></span>
<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 select-none"></canvas>
