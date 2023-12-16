import path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import WindiCSS from 'vite-plugin-windicss'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

const rendererRoot = path.resolve('src/renderer')

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        // Exclude plugins that are already ESM
        exclude: ['emittery', '@vinejs/vine'],
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
        config: path.resolve('./windi.config.ts'),
      }),
      Vue(),
      VueRouter({
        dts: 'src/routes.d.ts',
        root: rendererRoot,
        routesFolder: 'src/pages',
        importMode: 'sync',
      }),
      AutoImport({
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables'],
        imports: [
          'vue',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
            ],
          },
        ],
      }),
      Components({
        dts: 'src/components.d.ts',
        dirs: ['src/components'],
        resolvers: [
          NaiveUiResolver(),
          // @ts-expect-error can ignore this!
          (name: string) => {
            if (name.startsWith('Icon')) {
              return { from: 'lucide-vue-next', name: name.replace('Icon', '') }
            }
          },
        ],
      }),
    ],
  },
})
