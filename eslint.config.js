const { default: antfu } = require('@antfu/eslint-config')

module.exports = antfu({
  ignores: [
    'out/*',
    'dist/*',
    'node_modules/*',
    'src/main/db/generated.ts',
  ],
  rules: {
    'no-console': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 1,
      },
      multiline: {
        max: 1,
      },
    }],
    'vue/block-order': ['error', {
      order: [['template', 'script'], 'style'],
    }],
  },
})
