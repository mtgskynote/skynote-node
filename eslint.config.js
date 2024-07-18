import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    ignores: [
      '**/.git',
      '**/.svn',
      '**/.hg',
      '**/node_modules',
      'build',
      'coverage',
      '**/*.html',
      '**/*.yml',
      '**/*.yaml',
      '.github/workflows',
      '**/.venv',
      '**/venv',
      '**/*.conf',
      '**/*.config',
      '**/*.ini',
      '**/*.log',
      '**/*.tmp',
      '**/*.temp',
      '**/*.swp',
    ],
  },
  pluginJs.configs.recommended,
  pluginReactConfig,
]
