export interface NoteStats {
	minutes: number;
	words: number;
	characters: number;
	bytes: number;
}

const WORDS_PER_MINUTE = 230;

/** Length stats for a raw markdown note. Code blocks count toward bytes but not reading. */
export function noteStats(raw: string): NoteStats {
	const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

	const text = body
		.replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, '')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
		.replace(/[#>*_`|~]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	const words = text.match(/\S+/g)?.length ?? 0;

	return {
		minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
		words,
		characters: [...text].length,
		bytes: new TextEncoder().encode(body).length
	};
}
