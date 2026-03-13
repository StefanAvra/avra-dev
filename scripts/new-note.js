import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const title = process.argv[2];

function usage(){
	console.log('Usage: npm run new-note -- "My Note Title"');
}
if (!title) {
	usage();
	process.exit(1);
}


const slug = title
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-|-$/g, '');

const date = new Date().toISOString().split('T')[0];
const path = join('src/lib/posts', `${slug}.md`);

if (existsSync(path)) {
	console.error(`Already exists: ${path}`);
	process.exit(1);
}

const content = `---
title: ${title}
date: ${date}
description:
---

`;

writeFileSync(path, content);
console.log(`Created: ${path}`);
