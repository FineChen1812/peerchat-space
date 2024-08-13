import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import fs from 'node:fs'
import path from 'node:path'
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue','vue-router'],
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss, 
        autoprefixer
      ]
    },
  },
  server: {
    port: 9998,
    host:'0.0.0.0',
    open: true,
    https: {
      cert: fs.readFileSync(path.join(__dirname, 'src/ssl/server.crt')),
      key: fs.readFileSync(path.join(__dirname, 'src/ssl/server.key'))
    }
  },
})
