/* eslint-env node */
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
        name: 'SIARM · Academic Resource Management — IUGET Bonabéri',
        short_name: 'SIARM',
        description: 'Unified academic platform for IUGET Bonabéri — attendance, results, timetable, tuition payment, parent portal.',
        theme_color: '#1e3aa0',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        lang: 'en',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/brand/iuget-logo.png',       sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/brand/iuget-logo.png',       sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/brand/iuget-logo-white.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Pay tuition',  short_name: 'Pay',     description: 'Open the tuition payment page', url: '/student/fees',  icons: [{ src: '/brand/iuget-logo.png', sizes: '192x192' }] },
          { name: 'My timetable', short_name: 'Schedule',description: 'View this week\'s timetable',     url: '/student/timetable', icons: [{ src: '/brand/iuget-logo.png', sizes: '192x192' }] },
          { name: 'My ID card',   short_name: 'ID Card', description: 'Open the student ID card',       url: '/student/idcard', icons: [{ src: '/brand/iuget-logo.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // Aggressively precache every static asset so the whole UI is available offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf,json,webp}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,   // 5 MB ceiling
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/downloads\//, /^\/deliverables/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Google-Fonts stylesheet — cache-first, long expiry
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'siarm-fonts-css',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google-Fonts woff2 files — cache-first
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'siarm-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Dicebear avatars — cache-first with generous size
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'siarm-avatars',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // IUGET brand assets
            urlPattern: /\/brand\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'siarm-brand', expiration: { maxEntries: 20 } },
          },
          {
            // Firestore real-time — stale-while-revalidate so the cached
            // payload is shown immediately and refreshed in the background
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'siarm-firestore',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Anything else under the SIARM origin — fall back to cache
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'siarm-html',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'vendor-charts': ['recharts'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-pdf': ['jspdf', 'html2canvas'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
