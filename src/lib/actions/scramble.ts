const charset = '!<>-_\\/[]{}=+*^?#~@$%&|`';

type ScrambleController = { out: () => Promise<void> };
const registry = new Set<ScrambleController>();
let prevSnapshot = '';

function flattenText(node: HTMLElement): string {
	const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
	let result = '';
	let n: Node | null;
	while ((n = walker.nextNode())) {
		result += n.textContent ?? '';
	}
	return result;
}

function animate(
	node: HTMLElement,
	duration: number,
	direction: 'in' | 'out',
	prevText?: string
): Promise<void> {
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
					if (direction === 'in' && prevText && prevText[i] === char) return char;
					if (direction === 'in') {
						const revealed = i < threshold;
						if (revealed) return char;
						// Before reveal: show old char if available, otherwise scramble
						if (prevText && i < prevText.length) {
							const old = prevText[i];
							return old === ' ' || old === '\n'
								? old
								: charset[Math.floor(Math.random() * charset.length)];
						}
						return charset[Math.floor(Math.random() * charset.length)];
					}
					// out direction
					const revealed = i >= threshold;
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

		// When we have prevText, seed text nodes with old content immediately
		// so stable characters are visible from the very start (no flash)
		if (direction === 'in' && prevText) {
			let offset = 0;
			for (const { node: textNode, original } of textNodes) {
				let seeded = '';
				for (let i = 0; i < original.length; i++) {
					const gi = offset + i;
					if (gi < prevText.length) {
						seeded += prevText[gi];
					} else {
						seeded += charset[Math.floor(Math.random() * charset.length)];
					}
				}
				textNode.textContent = seeded;
				offset += original.length;
			}
		}

		requestAnimationFrame(frame);
	});
}

export function scramble(node: HTMLElement, duration = 300) {
	const savedPrev = prevSnapshot;
	prevSnapshot = '';

	const controller: ScrambleController = {
		out: () => {
			prevSnapshot = flattenText(node);
			return animate(node, duration * 0.6, 'out');
		}
	};

	registry.add(controller);
	animate(node, duration, 'in', savedPrev || undefined);

	return {
		destroy() {
			registry.delete(controller);
		}
	};
}

export function scrambleAllOut(): Promise<void[]> {
	return Promise.all([...registry].map((c) => c.out()));
}
