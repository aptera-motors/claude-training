import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const usecases = defineCollection({
  loader: file('src/content/usecases/usecases.json'),
  schema: z.object({
    mode: z.enum(['chat', 'cowork', 'code']),
    role: z.enum([
      'general',
      'finance',
      'marketing',
      'engineering',
      'manufacturing',
      'cad',
    ]),
    icon: z.string(),
    title: z.string(),
    blurb: z.string(),
    detail: z.string(),
    prompt: z.string(),
    order: z.number(),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    letter: z.string(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
  }),
});

const wins = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/wins' }),
  schema: z.object({
    title: z.string(),
    who: z.string(),
    team: z.string(),
    mode: z.string(),
    timeSaved: z.string().optional(),
    date: z.string(),
  }),
});

export const collections = { usecases, glossary, faq, wins };
