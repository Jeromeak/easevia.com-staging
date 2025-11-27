import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'never', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: '*', next: ['block-like', 'return'] },
        { blankLine: 'always', prev: ['block-like'], next: '*' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
