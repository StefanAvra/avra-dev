# avra.dev

Personal site and notes, built with SvelteKit and statically generated. Notes are
authored as Markdown and can be mirrored to the AT Protocol via the
[standard.site](https://standard.site) lexicons.

## Stack

- **[SvelteKit](https://svelte.dev/docs/kit)** (Svelte 5) with **[`adapter-static`](https://svelte.dev/docs/kit/adapter-static)** — fully prerendered, no server runtime
- **[mdsvex](https://mdsvex.pngwn.io/)** — Markdown notes compiled to Svelte components
- **[Tailwind CSS](https://tailwindcss.com/)** v4
- Deployed to **GitHub Pages** (custom domain `avra.dev` via `static/CNAME`)

## Development

```sh
npm install
npm run dev          # dev server
npm run build        # production build -> build/
npm run preview      # preview the production build
```

Other scripts:

```sh
npm run check        # svelte-check (type checking)
npm run lint         # prettier --check + eslint
npm run format       # prettier --write
```

## Writing notes

Notes live in `src/lib/posts/*.md` and are served at `/notes/<slug>`.

Create a new note:

```sh
npm run new-note -- "My Note Title"
```

This scaffolds `src/lib/posts/my-note-title.md` with frontmatter:

```md
---
title: My Note Title
date: 2026-06-11
description:
---
```

The listing (`/notes`) and individual pages are generated from these files at build
time — no database or CMS.

## Publishing to atproto (standard.site)

Notes can be mirrored to your AT Protocol account's PDS as
[`site.standard.document`](https://standard.site/docs/lexicons/document) records, so
they're discoverable across the atmosphere (richer Bluesky previews, other readers).
Markdown in git stays the source of truth — this is an additive, idempotent mirror.

### Setup

1. Create an **app password** at bsky.social → Settings → Privacy and security →
   App Passwords (not your account password).
2. Copy the env template and fill it in:

   ```sh
   cp .env.example .env
   ```

   ```
   BLUESKY_HANDLE=you.bsky.social
   BLUESKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   # BLUESKY_SERVICE=https://bsky.social   # override if self-hosting / different PDS
   ```

   `.env` is gitignored.

### Publish

```sh
npm run publish-note -- migrated-to-sveltekit   # one note by slug
npm run publish-note -- --all                   # all notes
```

The script (`scripts/publish-atproto.js`):

- Upserts a `site.standard.publication` record (`rkey: self`) for the site.
- Upserts a `site.standard.document` record per note (`rkey = slug`, so re-running
  updates rather than duplicates).
- Writes the record's `atproto_uri` back into the note's frontmatter — commit this.
- Generates `static/.well-known/site.standard.publication` (ownership verification).

At build time, each published note also emits a
`<link rel="site.standard.document" href="at://…">` tag in its `<head>`, completing
the bidirectional verification.

## Project structure

```
src/
  lib/
    posts/            # Markdown notes (source of truth)
    components/       # Svelte components
    actions/          # Svelte actions
  routes/
    notes/            # /notes listing + /notes/[slug] pages
    projects/
scripts/
  new-note.js         # scaffold a new note
  publish-atproto.js  # mirror notes to atproto / standard.site
static/               # copied verbatim (CNAME, robots.txt, .well-known, …)
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes
`build/` to GitHub Pages.
