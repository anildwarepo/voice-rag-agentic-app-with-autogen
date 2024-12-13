import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/static/static",
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
      alias: {
          "@": path.resolve(__dirname, "./src")
      }
  },
   base: "/static/static/"
})
