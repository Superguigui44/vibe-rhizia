import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        exemples: 'exemples.html',
        mentionsLegales: 'mentions-legales.html',
        politiqueConfidentialite: 'politique-confidentialite.html'
      }
    }
  }
})
