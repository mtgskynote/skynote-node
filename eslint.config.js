import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
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
];
