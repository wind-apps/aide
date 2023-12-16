import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [
      Vue(),
      AutoImport({
        dts: './src/auto-imports.d.ts',
        imports: ['vue'],
      }),
      Components({
        dts: './src/components.d.ts',
        resolvers: [
          PrimeVueResolver({
            importIcons: true,
            importStyle: true,
            importTheme: 'lara-light-purple',
            prefix: 'P',
          }),
        ],
      }),
    ],
  },
})
