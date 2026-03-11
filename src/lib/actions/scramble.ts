const charset = '!<>-_\\/[]{}=+*^?#~@$%&|`qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

let prevSnapshot = '';
let activeNode: HTMLElement | null = null;

function flattenText(node: HTMLElement): string {
	const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
	let result = '';
	let n: Node | null;
	while ((n = walker.nextNode())) {
		result += n.textContent ?? '';
	}
	return result;
}

function randomChar() {
	return charset[Math.floor(Math.random() * charset.length)];
}

function animate(node: HTMLElement, duration: number, prevText?: string): Promise<void> {
	return new Promise((resolve) => {
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
		const textNodes: { node: Text; original: string }[] = [];
		let n: Node | null;
		while ((n = walker.nextNode())) {
			const t = n as Text;
			textNodes.push({ node: t, original: t.textContent ?? '' });
		}

		const newText = textNodes.map((t) => t.original).join('');
		const prevLen = prevText?.length ?? 0;
		const maxLen = Math.max(newText.length, prevLen);
		const start = performance.now();

		function frame(now: number) {
			const progress = Math.min((now - start) / duration, 1);
			const threshold = Math.floor(progress * maxLen);

			let result = '';
			for (let i = 0; i < maxLen; i++) {
				const newChar = i < newText.length ? newText[i] : null;
				const oldChar = prevText && i < prevLen ? prevText[i] : null;

				if (i < threshold) {
					result += newChar ?? '';
				} else {
					if (newChar !== null) {
						if (newChar === ' ' || newChar === '\n') result += newChar;
						else if (oldChar === newChar) result += newChar;
						else result += randomChar();
					} else {
						if (oldChar === ' ' || oldChar === '\n') result += oldChar;
						else result += randomChar();
					}
				}
			}

			let offset = 0;
			for (let t = 0; t < textNodes.length; t++) {
				const orig = textNodes[t].original;
				if (t === textNodes.length - 1) {
					textNodes[t].node.textContent = result.slice(offset);
				} else {
					textNodes[t].node.textContent = result.slice(offset, offset + orig.length);
					offset += orig.length;
				}
			}

			if (progress < 1) requestAnimationFrame(frame);
			else {
				for (const { node: textNode, original } of textNodes) {
					textNode.textContent = original;
				}
				resolve();
			}
		}

		if (prevText) {
			let seeded = '';
			for (let i = 0; i < maxLen; i++) {
				if (i < prevLen) seeded += prevText[i];
				else seeded += randomChar();
			}
			if (textNodes.length > 0) {
				const last = textNodes.length - 1;
				let offset = 0;
				for (let t = 0; t < textNodes.length; t++) {
					const orig = textNodes[t].original;
					if (t === last) {
						textNodes[t].node.textContent = seeded.slice(offset);
					} else {
						textNodes[t].node.textContent = seeded.slice(offset, offset + orig.length);
						offset += orig.length;
					}
				}
			}
		}

		requestAnimationFrame(frame);
	});
}

export function scramble(node: HTMLElement, duration = 300) {
	const savedPrev = prevSnapshot;
	prevSnapshot = '';
	activeNode = node;

	animate(node, duration, savedPrev || undefined);

	return {
		destroy() {
			activeNode = null;
		}
	};
}

export function snapshotScramble() {
	if (activeNode) {
		prevSnapshot = flattenText(activeNode);
	}
}
