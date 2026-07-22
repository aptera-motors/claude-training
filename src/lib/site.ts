// Base-path-safe link helper.
// Astro's import.meta.env.BASE_URL is the configured `base` (e.g. "/claude-training").
// Always build internal hrefs through href() so links work on GitHub Pages subpaths.

const BASE = import.meta.env.BASE_URL; // e.g. "/claude-training" (or "/" in some contexts)

/**
 * Join the site base path with a relative path.
 * href('/modes/')  -> '/claude-training/modes/'
 * href('/')        -> '/claude-training/'
 */
export function href(path: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rel = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rel}`;
}

/** Absolute URL to a build asset under the base path (e.g. pagefind). */
export function asset(path: string): string {
  return href(path);
}

// ---- Site navigation / page order (single source of truth) ----

export interface NavPage {
  id: string;       // pageId used for progress tracking
  label: string;    // sidebar + prev/next label
  href: string;     // base-relative path (pass through href())
  emoji: string;    // card / hero icon
  blurb: string;    // one-liner for card grids
  readMinutes: number; // estimated reading time in minutes
}

export interface NavGroup {
  title: string;
  pages: NavPage[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'START HERE',
    pages: [
      { id: 'home', label: 'Home', href: '/', emoji: '🏠', blurb: 'The front door to your AI training.', readMinutes: 0 },
      { id: 'getting-started', label: 'Getting Started', href: '/getting-started/', emoji: '🚀', blurb: 'Get logged in and running in five minutes.', readMinutes: 5 },
      { id: 'modes', label: 'The Three Modes', href: '/modes/', emoji: '🎛️', blurb: 'Chat, Co-Work, and Code — when to use each.', readMinutes: 9 },
      { id: 'models', label: 'Choosing Your Model', href: '/models/', emoji: '🧠', blurb: 'Haiku, Sonnet, Opus, Fable — the right brain for the job.', readMinutes: 7 },
    ],
  },
  {
    title: 'GET GOOD',
    pages: [
      { id: 'prompting', label: 'Prompting 101', href: '/prompting/', emoji: '✍️', blurb: 'Write prompts that actually get results.', readMinutes: 7 },
      { id: 'manual-looping', label: 'Manual Looping', href: '/manual-looping/', emoji: '🔁', blurb: 'Stop one-shot prompting — iterate to great results.', readMinutes: 6 },
      { id: 'tokenomics', label: 'Tokenomics', href: '/tokenomics/', emoji: '🪙', blurb: 'What tokens are and why they matter.', readMinutes: 5 },
      { id: 'effort', label: 'Effort Levels', href: '/effort/', emoji: '🎚️', blurb: 'The second dial: how hard Claude thinks — and what it costs.', readMinutes: 6 },
      { id: 'context-window', label: 'Context Window', href: '/context-window/', emoji: '🪟', blurb: "Claude's working memory — and how to manage it.", readMinutes: 7 },
      { id: 'memory', label: 'Memory & Projects', href: '/memory/', emoji: '💾', blurb: 'How Claude remembers across sessions — and how to make it stick.', readMinutes: 6 },
      { id: 'agentic-looping', label: 'Agentic Looping', href: '/agentic-looping/', emoji: '🤖', blurb: 'Let Claude run its own loop until the job is done.', readMinutes: 8 },
      { id: 'apps', label: 'Apps Compared', href: '/apps/', emoji: '⚖️', blurb: 'Which Claude app for which job.', readMinutes: 5 },
      { id: 'm365', label: 'M365 Plugins', href: '/m365/', emoji: '📎', blurb: 'Claude inside the Microsoft tools you already use.', readMinutes: 6 },
      { id: 'email-triage', label: 'Email Triage', href: '/email-triage/', emoji: '📬', blurb: 'Your inbox sorted every morning — only what actually needs you.', readMinutes: 6 },
      { id: 'chrome', label: 'Claude in Chrome', href: '/chrome/', emoji: '🌐', blurb: 'Claude working inside your browser — on the sites without a connector.', readMinutes: 7 },
    ],
  },
  {
    title: 'REFERENCE',
    pages: [
      { id: 'connectors', label: 'Connectors & Skills', href: '/connectors/', emoji: '🔌', blurb: 'Plug Claude into your data and workflows.', readMinutes: 8 },
      { id: 'safety', label: 'Safety & Data', href: '/safety/', emoji: '🛡️', blurb: 'What is safe to share and what is not.', readMinutes: 5 },
      { id: 'faq', label: 'FAQ', href: '/faq/', emoji: '❓', blurb: 'The questions everyone asks.', readMinutes: 4 },
      { id: 'glossary', label: 'Glossary', href: '/glossary/', emoji: '📖', blurb: 'Plain-English definitions of the jargon.', readMinutes: 4 },
    ],
  },
  {
    title: 'COMMUNITY',
    pages: [
      { id: 'wins', label: 'Win Gallery', href: '/wins/', emoji: '🏆', blurb: 'Real wins from real Aptera teams.', readMinutes: 3 },
    ],
  },
];

// Flat ordered list (curriculum order) for prev/next + progress.
export const PAGE_ORDER: NavPage[] = NAV_GROUPS.flatMap((g) => g.pages);

export const TOTAL_PAGES = PAGE_ORDER.length;

export const TOTAL_MINUTES = PAGE_ORDER.reduce((s, p) => s + p.readMinutes, 0);

/** Find prev/next pages around a given pageId. */
export function prevNext(pageId: string): { prev: NavPage | null; next: NavPage | null } {
  const idx = PAGE_ORDER.findIndex((p) => p.id === pageId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? PAGE_ORDER[idx - 1] : null,
    next: idx < PAGE_ORDER.length - 1 ? PAGE_ORDER[idx + 1] : null,
  };
}

export const PROGRESS_KEY = 'aptera-ai-progress';
