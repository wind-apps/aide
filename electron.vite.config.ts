import path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import WindiCSS from 'vite-plugin-windicss'



const rendererRoot = path.resolve('src/renderer')

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['emittery'],
      }),
    ],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': path.resolve('src/renderer/src'),
        '@': path.resolve('src/renderer/src'),
      },
    },
    plugins: [
      WindiCSS({
        root: rendererRoot,
        config: path.resolve('./windi.config.ts')
      }),
      Vue(),
      VueRouter({
        dts: 'src/routes.d.ts',
        root: rendererRoot,
        routesFolder: 'src/pages',
        importMode: 'sync'
      }),
      AutoImport({
        dts: 'src/auto-imports.d.ts',
        imports: ['vue', VueRouterAutoImports],
      }),
      Components({
        dts: 'src/components.d.ts',
        dirs: ['src/components'],
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
