import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served from https://mindfulmod.github.io/learn/ on GitHub Pages.
// Set VITE_BASE=/ for a custom domain or local preview at the root.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/learn/',
})
