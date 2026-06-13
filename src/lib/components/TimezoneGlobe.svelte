<script lang="ts">
	const SIZE = 240; // CSS px square canvas
	const FONT_SIZE = 10; // px monospace
	const SPIN_TURNS = 2;
	const SETTLE_MS = 4000;
	const LAND_RAMP = '.:-=+*#%@'; // dark -> bright shading for land
	const OCEAN_RAMP = ' .·°·.'; // faint ocean; leading space = skip

	// Berlin
	const latB = (52.52 * Math.PI) / 180;
	const lonB = (13.4 * Math.PI) / 180;
	const SPIN_END = lonB + Math.PI * 2 * SPIN_TURNS; // settles with Berlin front-centered

	// View-space light direction (upper-right-front), normalized.
	const L = (() => {
		const v = [0.6, 0.5, 0.7];
		const m = Math.hypot(v[0], v[1], v[2]);
		return [v[0] / m, v[1] / m, v[2] / m];
	})();

	// Coarse world map as longitude runs per latitude row.
	// 36 rows of 5deg (row 0 = +90N .. row 35 = -90S); cols are 5deg lon (col 0 = -180).
	// Each run is [startCol, endCol] inclusive. Approximate continent silhouettes.
	const MASK_W = 72;
	const MASK_H = 36;
	const LAND: [number, number][][] = [
		[], // 90N
		[], // 85
		[[8, 11], [26, 30]], // 80
		[[6, 22], [25, 31], [50, 66]], // 75
		[[3, 24], [26, 32], [36, 71]], // 70
		[[2, 24], [27, 31], [34, 71]], // 65
		[[3, 24], [28, 30], [33, 71]], // 60
		[[8, 24], [34, 71]], // 55
		[[8, 22], [34, 70]], // 50
		[[10, 22], [35, 70]], // 45
		[[11, 22], [34, 66]], // 40
		[[12, 21], [33, 64], [66, 67]], // 35
		[[14, 20], [32, 63]], // 30
		[[15, 19], [31, 54], [56, 60]], // 25
		[[16, 19], [31, 54], [56, 62]], // 20
		[[17, 19], [31, 47], [51, 53], [56, 62]], // 15
		[[20, 30], [32, 46], [56, 63]], // 10
		[[19, 30], [33, 45], [56, 64]], // 5
		[[19, 29], [34, 44], [57, 64]], // 0
		[[19, 30], [35, 44], [58, 63]], // -5
		[[20, 30], [36, 44], [58, 66]], // -10
		[[20, 29], [37, 44], [59, 66]], // -15
		[[21, 28], [38, 44], [58, 66]], // -20
		[[22, 28], [39, 44], [58, 65]], // -25
		[[23, 27], [40, 44], [59, 64]], // -30
		[[24, 27], [41, 43], [61, 64]], // -35
		[[24, 26]], // -40
		[[24, 26]], // -45
		[[25, 26]], // -50
		[[25, 25]], // -55
		[[26, 26]], // -60
		[[8, 64]], // -65
		[[2, 69]], // -70
		[[0, 71]], // -75
		[[0, 71]], // -80
		[[0, 71]] // -90
	];

	function sampleLand(lat: number, lon: number): boolean {
		const u = (lon + Math.PI) / (2 * Math.PI); // [0,1)
		const v = (Math.PI / 2 - lat) / Math.PI; // 0 = N pole .. 1 = S pole
		const mx = Math.min(MASK_W - 1, Math.max(0, Math.floor(u * MASK_W)));
		const my = Math.min(MASK_H - 1, Math.max(0, Math.floor(v * MASK_H)));
		const runs = LAND[my];
		for (let i = 0; i < runs.length; i++) {
			if (mx >= runs[i][0] && mx <= runs[i][1]) return true;
		}
		return false;
	}

	function easeOutCubic(x: number): number {
		return 1 - (1 - x) ** 3;
	}

	let { tz }: { tz: string } = $props();

	let open = $state(false);
	let canvas: HTMLCanvasElement;
	let colorProbe: HTMLSpanElement; // .text-accent
	let fgProbe: HTMLSpanElement; // .text-fg
	let container: HTMLSpanElement;

	// rAF loop runs only while the popover is open.
	$effect(() => {
		if (!open) return;

		const ctx = canvas.getContext('2d')!;
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let dpr = 1;
		let charW = 0;
		let cols = 0;
		let rows = 0;
		let ccx = 0;
		let ccy = 0;
		let R = 0;
		let aspect = 1;
		let accent = '';
		let fg = '';

		function resize() {
			dpr = window.devicePixelRatio || 1;
			canvas.width = SIZE * dpr;
			canvas.height = SIZE * dpr;
			canvas.style.width = SIZE + 'px';
			canvas.style.height = SIZE + 'px';

			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(dpr, dpr);
			ctx.font = `${FONT_SIZE}px monospace`;
			ctx.textBaseline = 'top';

			accent = getComputedStyle(colorProbe).color;
			fg = getComputedStyle(fgProbe).color;

			charW = ctx.measureText('█').width;
			cols = Math.floor(SIZE / charW);
			rows = Math.floor(SIZE / FONT_SIZE);
			ccx = (cols - 1) / 2;
			ccy = (rows - 1) / 2;
			R = Math.min(cols, rows) / 2 - 1;
			aspect = charW / FONT_SIZE;
		}

		resize();
		window.addEventListener('resize', resize);

		const openT = performance.now();
		let raf: number;

		function frame(t: number) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const p = reduceMotion ? 1 : Math.min(1, (t - openT) / SETTLE_MS);
			const spin = SPIN_END * easeOutCubic(p);
			const cs = Math.cos(spin);
			const sn = Math.sin(spin);

			ctx.fillStyle = fg;
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const nx = ((c - ccx) * aspect) / R;
					const ny = (r - ccy) / R;
					const d2 = nx * nx + ny * ny;
					if (d2 > 1) continue;

					const sx = nx;
					const sy = -ny;
					const sz = Math.sqrt(1 - d2);
					const shade = Math.max(0, sx * L[0] + sy * L[1] + sz * L[2]);

					// inverse-spin the view point into texture/geographic space
					const tx = sx * cs + sz * sn;
					const tz = -sx * sn + sz * cs;
					const lat = Math.asin(sy);
					const lon = Math.atan2(tx, tz);

					let ch: string;
					let alpha: number;
					if (sampleLand(lat, lon)) {
						ch = LAND_RAMP[Math.min(LAND_RAMP.length - 1, Math.floor(shade * LAND_RAMP.length))];
						alpha = 0.35 + 0.65 * shade;
					} else {
						if (shade < 0.25) continue;
						ch = OCEAN_RAMP[Math.min(OCEAN_RAMP.length - 1, Math.floor(shade * OCEAN_RAMP.length))];
						if (ch === ' ') continue;
						alpha = 0.1 + 0.3 * shade;
					}
					ctx.globalAlpha = alpha;
					ctx.fillText(ch, c * charW, r * FONT_SIZE);
				}
			}

			// Berlin marker (pulsing dot), drawn on top.
			const btx = Math.cos(latB) * Math.sin(lonB);
			const bty = Math.sin(latB);
			const btz = Math.cos(latB) * Math.cos(lonB);
			const vx = btx * cs - btz * sn;
			const vz = btx * sn + btz * cs;
			if (vz > 0) {
				const mc = ccx + (vx * R) / aspect;
				const mr = ccy + -bty * R;
				ctx.fillStyle = accent;
				ctx.globalAlpha = (0.6 + 0.4 * Math.sin(t * 0.004)) * Math.min(1, vz * 1.5);
				ctx.fillText('◉', Math.round(mc) * charW, Math.round(mr) * FONT_SIZE);
			}

			ctx.globalAlpha = 1;
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
	onpointerdown={(e) => {
		if (open && container && !container.contains(e.target as Node)) open = false;
	}}
/>

<span
	bind:this={container}
	class="group relative"
	tabindex="0"
	role="button"
	aria-expanded={open}
	aria-label="Show a globe highlighting my location, Europe/Berlin"
	onpointerenter={(e) => {
		if (e.pointerType === 'mouse') open = true;
	}}
	onpointerleave={(e) => {
		if (e.pointerType === 'mouse') open = false;
	}}
	onpointerup={(e) => {
		if (e.pointerType !== 'mouse') open = !open;
	}}
	onfocus={() => (open = true)}
	onblur={() => (open = false)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open = !open;
		} else if (e.key === 'Escape') {
			open = false;
		}
	}}
>
	<span class="bracketed">{tz}</span>
	<span
		class="absolute top-[1lh] left-0 z-100 border border-border bg-subtle p-[0.5ch] {open
			? ''
			: 'invisible'}"
		role="img"
		aria-label="Rotating globe with my location highlighted"
	>
		<canvas bind:this={canvas} class="block select-none"></canvas>
	</span>
</span>

<span bind:this={colorProbe} class="hidden text-accent"></span>
<span bind:this={fgProbe} class="hidden text-fg"></span>
