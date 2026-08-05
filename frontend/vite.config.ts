import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // ustozhasan.uz domenining ildizidan ishlaydi (SPA yoʻnalishlari uchun muhim)
  base: '/',
  // inspectAttr faqat dasturlash rejimida kerak — production HTML ni ogʻirlashtirmaydi
  plugins: command === 'serve' ? [inspectAttr(), react()] : [react()],
  server: {
    port: 3000,
  },
  build: {
    assetsInlineLimit: 4096,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
