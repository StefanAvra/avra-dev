import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { AtpAgent, RichText } from '@atproto/api';
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
// app.bsky.feed.post.text caps at 300 graphemes.
const POST_TEXT_LIMIT = 300;

const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD, BLUESKY_SERVICE } = process.env;

// --- Helpers ----------------------------------------------------------------

function usage() {
	console.log('Usage: npm run publish-note -- <slug>');
	console.log('       npm run publish-note -- --all');
	console.log('');
	console.log('  --announce  also create the anchor Bluesky post that comments hang off,');
	console.log('              unless the post already has one. Public and irreversible.');
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

	const flags = args.filter((a) => a.startsWith('--'));
	const positional = args.filter((a) => !a.startsWith('--'));
	const announce = flags.includes('--announce');
	const slugs = flags.includes('--all') ? listSlugs() : positional;

	if (slugs.length === 0) {
		usage();
		process.exit(1);
	}

	const agent = new AtpAgent({ service: BLUESKY_SERVICE || 'https://bsky.social' });
	const { data: session } = await agent.login({
		identifier: BLUESKY_HANDLE,
		password: BLUESKY_APP_PASSWORD
	});
	const did = session.did;
	console.log(`Logged in as ${BLUESKY_HANDLE} (${did})`);

	// 1. Upsert the publication record (idempotent via fixed rkey).
	const { data: publication } = await agent.com.atproto.repo.putRecord({
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
		const uri = `at://${did}/site.standard.document/${slug}`;
		const tags = Array.isArray(data.tags) ? data.tags.filter(Boolean) : [];

		// The anchor post's cid has to survive in frontmatter: putRecord replaces the
		// whole record, so every later publish must re-supply bskyPostRef or drop it.
		let threadUri = data.bsky_thread_uri;
		let threadCid = data.bsky_thread_cid;

		const buildRecord = () => {
			const record = {
				$type: 'site.standard.document',
				site: publicationUri,
				title: data.title,
				path: `/notes/${slug}`,
				publishedAt: new Date(data.date).toISOString(),
				textContent: markdownToText(content).slice(0, TEXT_CONTENT_LIMIT)
			};
			if (data.description) record.description = data.description;
			if (tags.length) record.tags = tags;
			if (threadUri && threadCid) record.bskyPostRef = { uri: threadUri, cid: threadCid };
			return record;
		};

		const { data: doc } = await agent.com.atproto.repo.putRecord({
			repo: did,
			collection: 'site.standard.document',
			rkey: slug,
			record: buildRecord()
		});
		console.log(`Document: ${uri}`);

		// 4. Create the anchor Bluesky post that comments hang off — opt-in, and only
		//    when the post doesn't already have one.
		if (announce && !threadUri) {
			const body = data.description ? `${data.title}\n\n${data.description}` : data.title;
			const rt = new RichText({
				text: tags.length ? `${body}\n\n${tags.map((t) => `#${t}`).join(' ')}` : body
			});
			await rt.detectFacets(agent);
			// detectFacets also auto-links domain-shaped words, which would turn prose
			// like "Standard.site" in a description into a link. The URL belongs to the
			// embed card, so keep only the hashtag facets.
			const facets = (rt.facets ?? []).filter((f) =>
				f.features.some((feat) => feat.$type === 'app.bsky.richtext.facet#tag')
			);

			if (rt.graphemeLength > POST_TEXT_LIMIT) {
				console.error(
					`Skipping anchor post for "${slug}": text is ${rt.graphemeLength} graphemes ` +
						`(limit ${POST_TEXT_LIMIT}). Shorten the title, description, or tags.`
				);
			} else {
				// associatedRefs makes Bluesky render an enhanced Standard.site link card
				// instead of a plain one.
				const posted = await agent.post({
					text: rt.text,
					facets,
					embed: {
						$type: 'app.bsky.embed.external',
						external: {
							uri: `${PUBLICATION_URL}/notes/${slug}`,
							title: data.title,
							description: data.description || '',
							associatedRefs: [
								{ uri, cid: doc.cid },
								{ uri: publicationUri, cid: publication.cid }
							]
						}
					}
				});
				threadUri = posted.uri;
				threadCid = posted.cid;

				// Re-upsert so the document points back at its discussion thread. This
				// changes the document's cid, leaving the associatedRefs cid above
				// slightly stale — the circularity is inherent and the appview resolves
				// by URI, so it's cosmetic.
				await agent.com.atproto.repo.putRecord({
					repo: did,
					collection: 'site.standard.document',
					rkey: slug,
					record: buildRecord()
				});
				console.log(`Anchor post: ${threadUri}`);
			}
		}

		// Write the AT-URIs back into frontmatter: marks the post as published and
		// lets the build emit the per-document <link> verification tag.
		if (data.atproto_uri !== uri || data.bsky_thread_uri !== threadUri) {
			const front = { ...data, atproto_uri: uri };
			if (threadUri && threadCid) {
				front.bsky_thread_uri = threadUri;
				front.bsky_thread_cid = threadCid;
			}
			writeFileSync(path, matter.stringify(content, front));
		}
	}

	console.log('Done.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
