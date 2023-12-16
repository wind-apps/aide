import { defineConfig } from 'windicss/helpers'
import scrollbar from '@windicss/plugin-scrollbar'

export default defineConfig({
  attributify: true,
  plugins: [
    scrollbar,
  ],
  theme: {
    extend: {},
  },
  variants: {
    scrollbar: ['rounded'],
  },
})
