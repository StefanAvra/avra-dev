import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { AtpAgent } from '@atproto/api';
import matter from 'gray-matter';

// --- Config -----------------------------------------------------------------

const POSTS_DIR = 'src/lib/posts';
const PUBLICATION_URL = 'https://avra.dev';
const PUBLICATION_NAME = 'avra.dev';
const PUBLICATION_DESCRIPTION = 'Notes by Stefan Avramescu.';
const PUBLICATION_RKEY = 'self';
const WELL_KNOWN_PATH = 'static/.well-known/site.standard.publication';
// Plaintext is allowed up to 30000 chars / 3000 graphemes by the lexicon.
const TEXT_CONTENT_LIMIT = 3000;

const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD, BLUESKY_SERVICE } = process.env;

// --- Helpers ----------------------------------------------------------------

function usage() {
	console.log('Usage: npm run publish-note -- <slug>');
	console.log('       npm run publish-note -- --all');
}

/** Crudely strip markdown to plaintext for the `textContent` field. */
function markdownToText(md) {
	return md
		.replace(/```[\s\S]*?```/g, '') // fenced code blocks
		.replace(/`([^`]+)`/g, '$1') // inline code
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> text
		.replace(/^#{1,6}\s+/gm, '') // headings
		.replace(/^\s*>\s?/gm, '') // blockquotes
		.replace(/^\s*[-*+]\s+/gm, '') // bullets
		.replace(/(\*\*|__|\*|_|~~)/g, '') // emphasis markers
		.replace(/\r/g, '')
		.replace(/\n{2,}/g, '\n\n')
		.trim();
}

function readPost(slug) {
	const path = join(POSTS_DIR, `${slug}.md`);
	const raw = readFileSync(path, 'utf8');
	const { data, content } = matter(raw);
	return { path, raw, data, content };
}

function listSlugs() {
	return readdirSync(POSTS_DIR)
		.filter((f) => f.endsWith('.md'))
		.map((f) => f.replace(/\.md$/, ''));
}

// --- Main -------------------------------------------------------------------

async function main() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		usage();
		process.exit(1);
	}

	if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
		console.error('Missing BLUESKY_HANDLE / BLUESKY_APP_PASSWORD (see .env.example).');
		process.exit(1);
	}

	const slugs = args.includes('--all') ? listSlugs() : args;

	const agent = new AtpAgent({ service: BLUESKY_SERVICE || 'https://bsky.social' });
	const { data: session } = await agent.login({
		identifier: BLUESKY_HANDLE,
		password: BLUESKY_APP_PASSWORD
	});
	const did = session.did;
	console.log(`Logged in as ${BLUESKY_HANDLE} (${did})`);

	// 1. Upsert the publication record (idempotent via fixed rkey).
	await agent.com.atproto.repo.putRecord({
		repo: did,
		collection: 'site.standard.publication',
		rkey: PUBLICATION_RKEY,
		record: {
			$type: 'site.standard.publication',
			url: PUBLICATION_URL,
			name: PUBLICATION_NAME,
			description: PUBLICATION_DESCRIPTION
		}
	});
	const publicationUri = `at://${did}/site.standard.publication/${PUBLICATION_RKEY}`;
	console.log(`Publication: ${publicationUri}`);

	// 2. Write the .well-known verification artifact (domain -> record link).
	mkdirSync(dirname(WELL_KNOWN_PATH), { recursive: true });
	writeFileSync(WELL_KNOWN_PATH, publicationUri + '\n');
	console.log(`Wrote ${WELL_KNOWN_PATH}`);

	// 3. Upsert a document record per post (idempotent via rkey = slug).
	for (const slug of slugs) {
		const { path, data, content } = readPost(slug);

		const record = {
			$type: 'site.standard.document',
			site: publicationUri,
			title: data.title,
			path: `/notes/${slug}`,
			publishedAt: new Date(data.date).toISOString(),
			textContent: markdownToText(content).slice(0, TEXT_CONTENT_LIMIT)
		};
		if (data.description) record.description = data.description;

		await agent.com.atproto.repo.putRecord({
			repo: did,
			collection: 'site.standard.document',
			rkey: slug,
			record
		});

		const uri = `at://${did}/site.standard.document/${slug}`;

		// Write the AT-URI back into frontmatter: marks the post as published and
		// lets the build emit the per-document <link> verification tag.
		if (data.atproto_uri !== uri) {
			const updated = matter.stringify(content, { ...data, atproto_uri: uri });
			writeFileSync(path, updated);
		}
		console.log(`Document: ${uri}`);
	}

	console.log('Done.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
