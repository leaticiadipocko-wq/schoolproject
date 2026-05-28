import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// SIARM Vite config — PWA-enabled for offline access
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'brand/iuget-logo.png', 'brand/iuget-logo-white.png'],
      manifest: {
        name: 'SIARM · Smart Institution Academic Resource Management',
        short_name: 'SIARM',
        description: 'A unified AI-augmented academic platform for IUGET Bonabéri.',
        theme_color: '#1e3aa0',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        lang: 'en',
        icons: [
          { src: '/brand/iuget-logo.png',       sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/brand/iuget-logo.png',       sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/brand/iuget-logo-white.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Cache app shell + all js/css/png/svg for true offline operation
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Fonts from Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-css', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-webfonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            // Avatars
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'avatars', expiration: { maxEntries: 50 } },
          },
        ],
      },
      devOptions: {
        enabled: false,  // keep dev clean; PWA active in production build
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
