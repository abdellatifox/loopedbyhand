import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Patterns published by ContentOps ("Astro/Git" mode): it commits
 * src/content/patterns/<slug>.md plus public/images/patterns/<slug>.jpg.
 * The frontmatter shape is fixed on the ContentOps side — keep this schema in sync with it.
 * Files are read at build time and bundled into the worker (no fs at runtime).
 */
const CATEGORIES = ['blankets', 'hats-beanies', 'scarves', 'bags', 'home-decor', 'baby-items', 'clothing', 'accessories'] as const;

// ContentOps' shared crochet list uses a few names this site doesn't have.
const CATEGORY_ALIASES: Record<string, (typeof CATEGORIES)[number]> = {
  'baby-kids': 'baby-items',
  footwear: 'clothing',
  seasonal: 'home-decor',
};

// The model sometimes copies the template's "optional" placeholder verbatim.
const seoText = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() && v.trim().toLowerCase() !== 'optional' ? v : undefined),
  z.string().optional(),
);

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    // This site's own category slugs (src/lib/site.ts).
    category: z.preprocess((v) => (typeof v === 'string' ? CATEGORY_ALIASES[v] ?? v : v), z.enum(CATEGORIES)),
    cover: z.string(),
    publishDate: z.coerce.date(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    difficulty: z.enum(['beginner', 'easy', 'intermediate', 'advanced']),
    hook: z.string(),
    yarnWeight: z.string(),
    yardage: z.string().optional(),
    gauge: z.string().optional(),
    time: z.string().optional(),
    sizes: z.array(z.string()).default([]),
    stitches: z.array(z.string()).default([]),
    materials: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    seoTitle: seoText,
    seoDescription: seoText,
  }),
});

export const collections = { patterns };
