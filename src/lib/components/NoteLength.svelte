<script lang="ts">
	import type { NoteStats } from '$lib/noteStats';

	let { stats }: { stats: NoteStats } = $props();

	const UNITS = ['minutes', 'words', 'characters', 'bytes'] as const;
	type Unit = (typeof UNITS)[number];
	const STORAGE_KEY = 'note-length-unit';

	let unit = $state<Unit>('minutes');

	$effect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (UNITS.includes(stored as Unit)) unit = stored as Unit;
	});

	const next = $derived(UNITS[(UNITS.indexOf(unit) + 1) % UNITS.length]);

	function count(n: number, singular: string, plural: string) {
		return `${n.toLocaleString('en')} ${n === 1 ? singular : plural}`;
	}

	const label = $derived.by(() => {
		switch (unit) {
			case 'minutes':
				return `${stats.minutes} min`;
			case 'words':
				return count(stats.words, 'word', 'words');
			case 'characters':
				return count(stats.characters, 'char', 'chars');
			case 'bytes':
				return stats.bytes < 1000 ? `${stats.bytes} B` : `${(stats.bytes / 1000).toFixed(1)} kB`;
		}
	});

	function cycle() {
		unit = next;
		localStorage.setItem(STORAGE_KEY, unit);
	}
</script>

<button
	class="cursor-pointer border-0 bg-transparent p-0 text-muted tabular-nums transition-colors [font:inherit] hover:text-fg"
	onclick={cycle}
	aria-label="Note length: {label}. Show {next}."
	title="Show {next}"
>
	{label}
</button>
