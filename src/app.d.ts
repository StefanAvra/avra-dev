/// <reference types="vite/client" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	/** Committer date (YYYY-MM-DD) of the built commit, from vite.config.ts. */
	const __COMMIT_DATE__: string;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
