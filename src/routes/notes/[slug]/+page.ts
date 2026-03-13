import type { EntryGenerator, PageLoad } from "./$types";

export const prerender = true;

export const entries: EntryGenerator = async () => {
  const modules = import.meta.glob("/src/lib/posts/*.md");
  return Object.keys(modules).map((path) => ({
    slug: path.split("/").at(-1)!.replace(".md", ""),
  }));
};

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob("../../../lib/posts/*.md");
  const path = `../../../lib/posts/${params.slug}.md`;
  const mod = (await modules[path]()) as {
    default: unknown;
    metadata: { title: string; date: string; description: string };
  };
  return {
    content: mod.default,
    title: mod.metadata.title,
    date: mod.metadata.date,
    description: mod.metadata.description,
    slug: params.slug
  };
};
