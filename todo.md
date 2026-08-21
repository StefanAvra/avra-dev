- add a little globe, display the timezone
- rss
- opg tags
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

## remaining

- skeleton for comment section
- render tags on the site — chips on the note page and `/notes`, plus a prerendered
  `/notes/tag/[tag]` route. The data already exists in frontmatter (`tags:`) and is
  mirrored to `site.standard.document.tags`; only the UI is missing.
- `svelte.config.js` sets `paths.base = '/avra-dev'` for non-dev builds, so deployed
  nav links point at `/avra-dev/notes/...` and 404 — `avra.dev` serves from the apex.
- filter replies from muted/blocked accounts (needs auth, so probably never).
- external links should have a nicer icon. maybe fetch the favicons of external links and display them when available?
