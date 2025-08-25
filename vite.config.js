import config from './package.json';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import git from 'git-rev-sync';
import path from 'path';

const CurrentVersion = 'v' + config.version + '-' + git.short();

// https://vitejs.dev/config/
export default defineConfig({
  base: '/phi-chart-render/',
  plugins: [
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // 设置正确的MIME类型
          if (req.url.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
          } else if (req.url.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
          } else if (req.url.endsWith('.webmanifest')) {
            res.setHeader('Content-Type', 'application/manifest+json');
          }
          next();
        });
      }
    },
    createHtmlPlugin({
      inject: {
        data: {
          GIT_VERSION: CurrentVersion
        }
      }
    }),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\/phi-chart-render(.*?)\.(png|ogg|ico|ttf)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
            },
          }
        ],
      },
      minify: true,
      manifest: {
        id: 'misaliu-phi-chart-render',
        name: 'phi-chart-render',
        short_name: 'phi-chart-render',
        description: 'A Phigros chart render based on Pixi.js',
        scope: '/phi-chart-render/',
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#000000',
        includeAssets: [ './icons/favicon.ico' ],
        icons: [
          {
            src: './icons/64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: './icons/192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    }),
  ],
  define: {
    GIT_VERSION: JSON.stringify(CurrentVersion)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9000,
    open: true
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/media/[name]-[hash][extname]`;
          }
          else if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/img/[name]-[hash][extname]`;
          }
          else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/${ext}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  }
});


