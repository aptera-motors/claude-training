/// <reference types="astro/client" />

interface ApteraProgress {
  key: string;
  get: () => string[];
  count: () => number;
  has: (id: string) => boolean;
}

interface Window {
  apteraProgress?: ApteraProgress;
  PagefindUI?: new (opts: Record<string, unknown>) => unknown;
}
