const { default: antfu } = require('@antfu/eslint-config')

module.exports = antfu({
  ignores: [
    'out/*',
    'dist/*',
    'node_modules/*',
    'src/main/db/generated.ts'
  ],
  rules: {
    'no-console': 'off',
  },
})
