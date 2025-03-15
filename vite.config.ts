// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['zwitch']
    }
  },
  ssr: {
    noExternal: [
      /@mui\/.*/,
      'hast-util-raw'
    ]
  }
})