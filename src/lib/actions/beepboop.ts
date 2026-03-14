export function playSecretSound() {
	const ctx = new AudioContext();
	const gainNode = ctx.createGain();
	gainNode.connect(ctx.destination);

	const notes: [number, number][] = [
		[523.25, 0.08], // C5
		[587.33, 0.08], // D5
		[659.25, 0.08], // E5
		[783.99, 0.08], // G5
		[880.0, 0.08], // A5
		[1046.5, 0.12], // C6 (longer)
		[0, 0.06], // tiny rest
		[1318.5, 0.08], // E6
		[1568.0, 0.2] // G6 (held)
	];

	let t = ctx.currentTime;

	for (const [freq, dur] of notes) {
		if (freq === 0) {
			// rest — silence the gain
			gainNode.gain.setValueAtTime(0, t);
			t += dur;
			continue;
		}

		const osc = ctx.createOscillator();
		osc.type = 'square';
		osc.frequency.setValueAtTime(freq, t);
		osc.connect(gainNode);

		gainNode.gain.setValueAtTime(0.25, t);
		gainNode.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.01);

		osc.start(t);
		osc.stop(t + dur);
		t += dur;
	}
}
