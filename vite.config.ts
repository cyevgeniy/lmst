// vite.config.ts
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import { VitePWA } from 'vite-plugin-pwa'

export default {
  server: {
    host: '127.0.0.1',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        /* other options */
        /* when using generateSW the PWA plugin will switch to classic */
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
      manifest: {
        name: 'Lmst',
        short_name: 'Lmst',
        description: 'Lmst mastodon client',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
      cssModules: true,
    },
  },
  build: {
    cssMinify: 'lightningcss',
  },
}
