<script lang="ts">
	let {
		text,
		duration = 800,
		class: className = ''
	}: { text: string; duration?: number; class?: string } = $props();

	const charset = '!<>-_\\/[]{}=+*^?#~@$%&|`';

	let output = $state('');

	$effect(() => {
		const len = text.length;
		const start = performance.now();

		let raf: number;

		function frame(now: number) {
			const progress = Math.min((now - start) / duration, 1);
			const revealed = Math.floor(progress * len);

			output = [...text]
				.map((char, i) => {
					if (char === ' ') return ' ';
					if (i < revealed) return char;
					return charset[Math.floor(Math.random() * charset.length)];
				})
				.join('');

			if (progress < 1) {
				raf = requestAnimationFrame(frame);
			} else {
				output = text;
			}
		}

		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	});
</script>

<span class={className}>{output}</span>
