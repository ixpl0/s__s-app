import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default tsEslint.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...tsEslint.configs.strict,
  ...tsEslint.configs.stylistic,
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tsEslint.parser,
        extraFileExtensions: ['.svelte'],
        svelteConfig,
      },
    },
  },
  {
    rules: {
      // General strictness
      eqeqeq: ['error', 'always'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      curly: ['error', 'all'],
      'no-useless-concat': 'error',

      // TypeScript strictness
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // Svelte-specific rules
      'svelte/no-unused-svelte-ignore': 'error',
      'svelte/no-unused-class-name': 'off', // Отключено для Tailwind CSS и daisyUI
      'svelte/no-useless-mustaches': 'error',
      'svelte/no-reactive-functions': 'error',
      'svelte/no-reactive-literals': 'error',
      'svelte/require-each-key': 'error',
      'svelte/html-self-closing': [
        'error',
        {
          void: 'always',
          normal: 'never',
          component: 'always',
          svelte: 'always',
        },
      ],
      'svelte/prefer-class-directive': 'error',
      'svelte/prefer-style-directive': 'error',
      'svelte/shorthand-attribute': 'error',
      'svelte/shorthand-directive': 'error',
      'svelte/sort-attributes': [
        'error',
        {
          order: [
            'this',
            'bind:this',
            'id',
            'name',
            'slot',
            {
              match: ['!bind:*', '!on:*', '!use:*'],
              sort: 'alphabetical',
            },
            {
              match: 'bind:*',
              sort: 'alphabetical',
            },
            {
              match: 'on:*',
              sort: 'alphabetical',
            },
            {
              match: 'use:*',
              sort: 'alphabetical',
            },
          ],
        },
      ],
    },
  },
  { ignores: ['build/', '.svelte-kit/', 'dist/'] },
);
