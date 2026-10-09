import adapter from '@sveltejs/adapter-static';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import { createCssVariablesTheme } from 'shiki/core';
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Token colors come from --shiki-* vars in app.css, which map onto the site palette.
const palette = createCssVariablesTheme({
	name: 'palette',
	variablePrefix: '--shiki-',
	fontStyle: true
});

const highlighter = await createHighlighter({
	themes: [palette],
	langs: ['ts', 'js', 'svelte', 'bash', 'json', 'css', 'html', 'md', 'yaml', 'diff']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			highlight: {
				highlighter(code, lang) {
					const loaded = lang && highlighter.getLoadedLanguages().includes(lang);
					const html = highlighter.codeToHtml(code, {
						lang: loaded ? lang : 'text',
						theme: 'palette',
						transformers: [transformerNotationHighlight(), transformerNotationDiff()]
					});
					return `{@html \`${escapeSvelte(html)}\`}`;
				}
			},
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: 'prepend',
						properties: { className: ['heading-anchor'], ariaHidden: true, tabIndex: -1 },
						content: { type: 'text', value: '#' }
					}
				]
			]
		})
	],
	kit: {
		paths: {
			base: process.argv.includes('dev') ? '' : '/avra-dev'
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined
		})
	}
};

export default config;
