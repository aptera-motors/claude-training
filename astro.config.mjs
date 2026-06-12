import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aptera-motors.github.io',
  base: '/claude-training',
  vite: {
    plugins: [tailwindcss()],
  },
});
