import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            minify: false,
            rollupOptions: {
              external: ['better-sqlite3'],
              output: {
                format: 'cjs',
                entryFileNames: '[name].js',
              }
            }
          }
        }
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            minify: false,
            rollupOptions: {
              external: ['better-sqlite3'],
              output: {
                format: 'cjs',
                entryFileNames: '[name].js',
              }
            }
          }
        }
      },
    ]),
    renderer(),
  ],
})
