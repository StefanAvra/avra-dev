import adapter from '@sveltejs/adapter-static';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import { createCssVariablesTheme } from 'shiki/core';
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

// Token colors come from --shiki-* vars in app.css, which map onto the site palette.
const palette = createCssVariablesTheme({
	name: 'palette',
	variablePrefix: '--shiki-',
	fontStyle: true
});

// Lucide's `external-link` glyph (@lucide/svelte/icons/external-link), as hast
// so markdown links get the same icon the components use.
const externalLinkIcon = {
	type: 'element',
	tagName: 'svg',
	properties: {
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 2,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
		ariaHidden: 'true'
	},
	children: [
		'M15 3h6v6',
		'M10 14 21 3',
		'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'
	].map((d) => ({ type: 'element', tagName: 'path', properties: { d }, children: [] }))
};

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
				],
				[
					rehypeExternalLinks,
					{
						target: '_blank',
						rel: ['noopener', 'noreferrer'],
						content: [
							externalLinkIcon,
							{
								type: 'element',
								tagName: 'span',
								properties: { className: ['sr-only'] },
								children: [{ type: 'text', value: '(opens in a new tab)' }]
							}
						],
						contentProperties: { className: ['external-link-icon'] }
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
