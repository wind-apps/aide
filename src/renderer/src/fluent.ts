import { FluentBundle } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'

const enBundle = new FluentBundle('en')

export const fluent = createFluentVue({
  bundles: [enBundle],
})
