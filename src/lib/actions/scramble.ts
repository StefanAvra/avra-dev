const charset = '!<>-_\\/[]{}=+*^?#~@$%&|`';

type ScrambleController = { out: () => Promise<void> };
const registry = new Set<ScrambleController>();

function animate(node: HTMLElement, duration: number, direction: 'in' | 'out'): Promise<void> {
	return new Promise((resolve) => {
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
		const textNodes: { node: Text; original: string }[] = [];
		let n: Node | null;
		while ((n = walker.nextNode())) {
			const t = n as Text;
			textNodes.push({ node: t, original: t.textContent ?? '' });
		}

		const full = textNodes.map((t) => t.original).join('');
		const start = performance.now();

		function frame(now: number) {
			const progress = Math.min((now - start) / duration, 1);
			const threshold = Math.floor(progress * full.length);

			const scrambled = [...full]
				.map((char, i) => {
					if (char === ' ' || char === '\n') return char;
					const revealed = direction === 'in' ? i < threshold : i >= threshold;
					return revealed ? char : charset[Math.floor(Math.random() * charset.length)];
				})
				.join('');

			let offset = 0;
			for (const { node: textNode, original } of textNodes) {
				textNode.textContent = scrambled.slice(offset, offset + original.length);
				offset += original.length;
			}

			if (progress < 1) requestAnimationFrame(frame);
			else {
				for (const { node: textNode, original } of textNodes) {
					textNode.textContent = original;
				}
				resolve();
			}
		}

		requestAnimationFrame(frame);
	});
}

export function scramble(node: HTMLElement, duration = 600) {
	const controller: ScrambleController = {
		out: () => animate(node, duration * 0.6, 'out')
	};

	registry.add(controller);
	animate(node, duration, 'in');

	return {
		destroy() {
			registry.delete(controller);
		}
	};
}

export function scrambleAllOut(): Promise<void[]> {
	return Promise.all([...registry].map((c) => c.out()));
}
