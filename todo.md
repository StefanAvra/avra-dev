- add a little globe, display the timezone
- ~~rss~~ — done (summary-only `/rss.xml`)
- ~~opg tags~~ → see "meta, og & crawlers"
- lighthouse
- markdown styles

## atproto comments (Bluesky-as-comments pattern) — DONE

Shipped: `--announce` on `publish-note` creates one `app.bsky.feed.post` per note
(idempotent via `bsky_thread_uri` in frontmatter), and `Comments.svelte` loads its
replies client-side from the public AppView.

Two things the original plan had wrong, for future reference:

- `site.standard.document.bskyPostRef` is a **strongRef (`{uri, cid}`)**, not a bare
  at-URI. The cid has to live in frontmatter too (`bsky_thread_cid`), because
  `putRecord` replaces the whole record — every later publish re-supplies it or drops it.
- `app.bsky.embed.external` gained `associatedRefs` (May 2026): strongRefs to the
  backing `site.standard.*` records. Bluesky hydrates them into an enhanced card —
  confirmed live, the view now returns `readingTime` / `source` / `associatedProfiles`.

Also worth remembering: repo reads (`getRecord`, `listRecords`) must go to
`https://eurosky.social`, not `public.api.bsky.app` — the appview mirror of
`site.standard.*` records lags and returned stale nulls. `getPostThread` is fine on
the public AppView.

## icons

`@lucide/svelte` is in, introduced with the post-stats row. Convention to follow:

- `strokeWidth={1.5}`, not the default 2, which reads heavier than Geist Mono at 400.

Still text-only, to sweep once the convention feels right: nav brackets, `HotkeyBar`, `HotkeyHelp`, the theme toggle.

## meta, og & crawlers

### meta & notes — DONE

`Meta.svelte` on every route (title, description, canonical, og:\*, `twitter:card=summary`,
`article:*` on notes), `color-scheme` + `theme-color` in `app.html`, `fediverse:creator` in the
layout, `noindex` on /privacy, and `rel="site.standard.document"` is now in the prerendered head.
`paths.base` is gone.

Notes for later:

- Svelte keeps the deepest `<title>`, so the layout's one is only a fallback (error page).
- The prerender crawler follows `<link href>` too; `kit.prerender.handleInvalidUrl` skips `at://`.
- When og images land: add an `image` prop to Meta and switch to `summary_large_image`.
- Still open: `apple-touch-icon` (180px PNG), and Mastodon → profile → "author attribution" →
  add avra.dev.
- `theme-color` follows the OS, not the manual theme toggle.

### og images (generated per note)

- `src/routes/notes/[slug]/og.png/+server.ts`, prerendered, same `entries` as the note page.
  satori (JSX-ish object → SVG) + `@resvg/resvg-js` (SVG → PNG), 1200×630. Title in Geist Mono,
  description in Source Serif, `avra.dev` + date in the corner, site palette.
- satori can't read woff2, and the `@fontsource-variable/*` packages ship only woff2: load the
  `.woff` files from the static `@fontsource/geist-mono` / `@fontsource/source-serif-4` packages, or
  vendor TTFs into `src/lib/fonts/`.
- A default `/og.png` built the same way (name + tagline) for non-note pages.
- Check the satori docs via context7 before writing it (supported CSS is a subset: flexbox only).

### robots.txt, sitemap & co

- ~~sitemap.xml + robots.txt~~ — done: sitemap lists everything but /privacy; robots.txt blocks
  AI training crawlers only, with a `Content-Signal` line and the `Sitemap:` pointer.
- 404: there's no `+error.svelte`, and adapter-static's `fallback` is undefined, so GitHub Pages shows
  its own 404. Add `src/routes/+error.svelte` + `fallback: '404.html'` in `svelte.config.js`.
- optional: `static/.well-known/security.txt` (Contact + Expires).
- skipped on purpose: llms.txt (no major AI provider has said it uses it).

### check when done

- validate with opengraph.xyz / Bluesky's composer card preview / Mastodon preview (paste the URL,
  don't post).

## remaining

- skeleton for comment section
- ~~render tags on the site~~ — done: `#tag` links in the note meta row and on `/notes`,
  prerendered `/notes/tag/[tag]` pages.
- ~~`paths.base = '/avra-dev'` broke deployed links~~ — done, removed.
- filter replies from muted/blocked accounts (needs auth, so probably never).
- external links should have a nicer icon. maybe fetch the favicons of external links and display them when available?
