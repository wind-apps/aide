const { default: antfu } = require('@antfu/eslint-config')

module.exports = antfu({
  ignores: [
    'out/*',
    'dist/*',
    'node_modules/*',
  ],
  rules: {
    'no-console': 'off',
  },
})
