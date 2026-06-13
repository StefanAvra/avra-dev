- add a little globe, display the timezone
- rss
- opg tags
- lighthouse
- markdown styles

## atproto comments (Bluesky-as-comments pattern)

Goal: people reply on Bluesky; article pages load those replies client-side as comments.
Depends on: Model A document-mirroring already shipped (see `scripts/publish-atproto.js`,
which already logs into the PDS and upserts `site.standard.document` records per post).

### Step 1 — Anchor post (extend the publish script)

- When publishing a post, also create one `app.bsky.feed.post` that links to the article
  (`agent.post({ text, embed: external link card to https://avra.dev/notes/<slug> })`).
- Make it idempotent: store the created post's AT-URI in the post frontmatter
  (e.g. `bsky_thread_uri`) so re-publishing reuses it instead of creating duplicates.
  (Mirror the `atproto_uri` write-back pattern already in `publish-atproto.js`.)
- Also set the document record's `bskyPostRef` field to that AT-URI — standard.site's
  first-class field for the discussion thread — and re-`putRecord`.

### Step 2 — Comments UI (pure frontend, no backend, no auth)

- New component `src/lib/components/Comments.svelte`.
- On mount, fetch the thread (public, unauthenticated — no app password in the browser):
  `GET https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=<bsky_thread_uri>`
- Walk `thread.replies` recursively; render author handle/avatar, text, timestamp,
  likeCount/replyCount. Svelte escapes user text by default — keep it that way.
- Surface `bsky_thread_uri` through `notes/[slug]/+page.ts` (same as `atproto_uri` today),
  render `<Comments>` in `notes/[slug]/+page.svelte` below the article, only when present.
  Progressive enhancement: static page ships as today, comments hydrate after load.
- "Leave a comment" = a link to the anchor post on bsky.app so people can reply in-app.

### Caveats

- Only people with atproto accounts can comment.
- Deleting the anchor Bluesky post deletes the comments.
- Consider filtering replies from accounts you've muted/blocked.
