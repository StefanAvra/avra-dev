<script lang="ts">
	import { createNoise3D } from '$lib/noise';

	const BLOCKS = ['█', '▓', '▒'];
	const FONT_SIZE = 16;
	const RING_WIDTH = 80;
	const SPEED = 600;
	const HOVER_RADIUS = 100;

	// How fast the revealed trace fades when the pointer stops (per frame).
	const TRACE_DECAY = 0.95;
	const STAMP_STRENGTH = 0.045;
	// Animated brightness field sampled per grid cell.
	const NOISE_SCALE = 0.26;
	const NOISE_SPEED = 0.00012;

	let { secret = false, ondone }: { secret?: boolean; ondone?: () => void } = $props();

	let canvas: HTMLCanvasElement;
	let colorProbe: HTMLSpanElement;

	const noise3D = createNoise3D();

	// Plain refs read by the rAF loop — no reactivity needed.
	let mouseX: number | null = null;
	let mouseY: number | null = null;
	let prevX: number | null = null;
	let prevY: number | null = null;
	let ringActive = false;
	let ringStart: number | null = null;

	// Re-arm the expanding ring whenever the secret is triggered.
	$effect(() => {
		if (secret) {
			ringActive = true;
			ringStart = null;
		}
	});

	$effect(() => {
		const ctx = canvas.getContext('2d')!;

		let dpr = 1;
		let w = 0;
		let h = 0;
		let charWidth = 0;
		let cols = 0;
		let rows = 0;
		let cx = 0;
		let cy = 0;
		let maxRadius = 0;
		let color = '';
		// Per-cell trace intensity (0..1); the noise field shows through it.
		let intensity = new Float32Array(0);

		function resize() {
			dpr = window.devicePixelRatio || 1;
			w = window.innerWidth;
			h = window.innerHeight;

			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';

			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(dpr, dpr);
			ctx.font = `${FONT_SIZE}px monospace`;
			ctx.textBaseline = 'top';
			color = getComputedStyle(colorProbe).color;

			charWidth = ctx.measureText('█').width;
			cols = Math.ceil(w / charWidth) + 1;
			rows = Math.ceil(h / FONT_SIZE) + 1;
			intensity = new Float32Array(cols * rows);

			cx = w / 2;
			cy = h / 2;
			maxRadius = Math.sqrt(Math.max(cx, w - cx) ** 2 + Math.max(cy, h - cy) ** 2) + RING_WIDTH;
		}

		resize();
		window.addEventListener('resize', resize);

		// Add trace intensity in a soft disc, brightest at its center.
		function stamp(originX: number, originY: number) {
			const minC = Math.max(0, Math.floor((originX - HOVER_RADIUS) / charWidth));
			const maxC = Math.min(cols, Math.ceil((originX + HOVER_RADIUS) / charWidth));
			const minR = Math.max(0, Math.floor((originY - HOVER_RADIUS) / FONT_SIZE));
			const maxR = Math.min(rows, Math.ceil((originY + HOVER_RADIUS) / FONT_SIZE));

			for (let r = minR; r < maxR; r++) {
				for (let c = minC; c < maxC; c++) {
					const px = c * charWidth + charWidth / 2;
					const py = r * FONT_SIZE + FONT_SIZE / 2;
					const dist = Math.sqrt((px - originX) ** 2 + (py - originY) ** 2);

					if (dist < HOVER_RADIUS) {
						const i = r * cols + c;
						const add = STAMP_STRENGTH * (1 - dist / HOVER_RADIUS);
						intensity[i] = Math.min(1, intensity[i] + add);
					}
				}
			}
		}

		// Stamp every cell the pointer passed over since the last frame.
		function traceMovement() {
			if (mouseX === null || mouseY === null) return;
			// Start of a fresh stroke (pointer just went down / re-entered):
			// stamp the contact point itself instead of interpolating a line
			// from wherever the pointer was last seen.
			if (prevX === null || prevY === null) {
				prevX = mouseX;
				prevY = mouseY;
				stamp(mouseX, mouseY);
				return;
			}

			const dx = mouseX - prevX;
			const dy = mouseY - prevY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist === 0) return;

			const steps = Math.ceil(dist / (charWidth * 0.5));
			for (let s = 1; s <= steps; s++) {
				stamp(prevX + (dx * s) / steps, prevY + (dy * s) / steps);
			}
			prevX = mouseX;
			prevY = mouseY;
		}

		// Decay the trace and render the noise brightness through whatever remains.
		function renderTrace(t: number) {
			const tz = t * NOISE_SPEED;

			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const i = r * cols + c;
					const v = intensity[i] * TRACE_DECAY;
					intensity[i] = v;
					if (v < 0.02) continue;

					const brightness = noise3D(c * NOISE_SCALE, r * NOISE_SCALE, tz) * 0.5 + 0.5;
					const idx = brightness > 0.66 ? 0 : brightness > 0.33 ? 1 : 2;
					ctx.globalAlpha = Math.min(1, v) * (0.08 + 0.32 * brightness);
					ctx.fillText(BLOCKS[idx], c * charWidth, r * FONT_SIZE);
				}
			}
			ctx.globalAlpha = 1;
		}

		// Draw the expanding ring centered on the viewport.
		function drawRing(radius: number) {
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
		}

		let raf: number;

		function frame(t: number) {
			ctx.clearRect(0, 0, w * dpr, h * dpr);
			ctx.fillStyle = color;

			traceMovement();
			renderTrace(t);

			if (ringActive) {
				if (ringStart === null) ringStart = t;
				const radius = ((t - ringStart) / 1000) * SPEED;

				if (radius > maxRadius) {
					ringActive = false;
					ringStart = null;
					ondone?.();
				} else {
					drawRing(radius);
				}
			}

			raf = requestAnimationFrame(frame);
		}

		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<svelte:window
	onpointermove={(e) => {
		// Touch is handled via touch events below. A scrolling touch gets
		// pointercancel'd and stops firing pointermove, so we can't rely on it.
		if (e.pointerType === 'touch') return;
		mouseX = e.clientX;
		mouseY = e.clientY;
	}}
	onpointerleave={(e) => {
		if (e.pointerType === 'touch') return;
		mouseX = null;
		mouseY = null;
		prevX = null;
		prevY = null;
	}}
	ontouchstart={(e) => {
		// Begin a fresh stroke at the contact point. Clearing prev means a new
		// touch never draws a connecting line from the previous touch's spot.
		const t = e.touches[0];
		if (!t) return;
		mouseX = t.clientX;
		mouseY = t.clientY;
		prevX = null;
		prevY = null;
	}}
	ontouchmove={(e) => {
		// touchmove keeps firing for the whole drag — even while the page
		// scrolls — unlike pointermove, so the trail follows the finger.
		// We don't preventDefault, so normal scrolling is preserved.
		const t = e.touches[0];
		if (!t) return;
		mouseX = t.clientX;
		mouseY = t.clientY;
	}}
	ontouchend={() => {
		mouseX = null;
		mouseY = null;
		prevX = null;
		prevY = null;
	}}
	ontouchcancel={() => {
		mouseX = null;
		mouseY = null;
		prevX = null;
		prevY = null;
	}}
/>

<span bind:this={colorProbe} class="hidden text-accent"></span>
<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 select-none"></canvas>
