import path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import WindiCSS from 'vite-plugin-windicss'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

const mainRoot = path.resolve('src/main')
const rendererRoot = path.resolve('src/renderer')

const aliases = {
  '@main': mainRoot,
  '@renderer': path.join(rendererRoot, 'src'),
}

export default defineConfig({
  main: {
    resolve: {
      alias: aliases,
    },
    plugins: [
      externalizeDepsPlugin({
        // Exclude plugins that are already ESM
        exclude: ['emittery', '@vinejs/vine'],
      }),
    ],
  },
  preload: {
    resolve: {
      alias: aliases,
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: aliases,
    },
    plugins: [
      WindiCSS({
        root: rendererRoot,
        config: path.resolve('./windi.config.ts'),
      }),
      Vue(),
      VueRouter({
        dts: path.join(rendererRoot, 'src/routes.d.ts'),
        root: rendererRoot,
        routesFolder: path.join(rendererRoot, 'src/pages'),
        importMode: 'sync',
      }),
      AutoImport({
        dts: path.join(rendererRoot, 'src/auto-imports.d.ts'),
        dirs: [path.join(rendererRoot, 'src/composables')],
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
        dts: path.join(rendererRoot, 'src/components.d.ts'),
        dirs: [path.join(rendererRoot, 'src/components')],
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
