import { defineConfig } from 'windicss/helpers'
import scrollbar from '@windicss/plugin-scrollbar'

export default defineConfig({
  attributify: true,
  plugins: [
    scrollbar,
  ],
  theme: {
    fontFamily: {
      sans: ['Lexend', 'sans']
    },
    extend: {},
  },
  variants: {
    scrollbar: ['rounded'],
  },
})
