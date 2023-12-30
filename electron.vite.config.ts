import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import FluentPlugin from 'rollup-plugin-fluent-vue'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import WindiCSS from 'vite-plugin-windicss'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

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
      FluentPlugin(),
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
            'fluent-vue': ['useFluent'],
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
