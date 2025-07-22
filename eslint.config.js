import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
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
      'eqeqeq': ['error', 'always'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'curly': ['error', 'all'],

      // Semicolon rules (best practices)
      'semi': ['error', 'always'],
      'semi-spacing': ['error', {
        before: false,
        after: true,
      }],
      'semi-style': ['error', 'last'],

      // Code style and formatting
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'directive',
          next: 'directive',
        },
        {
          blankLine: 'always',
          prev: ['case', 'default'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['if', 'for', 'while', 'switch', 'try'],
        },
        {
          blankLine: 'always',
          prev: ['if', 'for', 'while', 'switch', 'try'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'function',
        },
        {
          blankLine: 'always',
          prev: 'function',
          next: '*',
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', {
        before: false,
        after: true,
      }],
      'key-spacing': ['error', {
        beforeColon: false,
        afterColon: true,
      }],
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': ['error', {
        before: true,
        after: true,
      }],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'no-multiple-empty-lines': ['error', {
        max: 1,
        maxEOF: 1,
      }],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'no-useless-concat': 'error',

      // TypeScript strictness
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: false,
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // Svelte-specific rules (аналоги Vue правил)
      'svelte/no-unused-svelte-ignore': 'error',
      'svelte/no-unused-class-name': 'off', // Отключено для Tailwind CSS и daisyUI
      'svelte/no-useless-mustaches': 'error',
      'svelte/no-reactive-functions': 'error',
      'svelte/no-reactive-literals': 'error',
      'svelte/require-each-key': 'error',
      'svelte/html-self-closing': ['error', {
        void: 'always',
        normal: 'always',
        component: 'always',
        svelte: 'always',
      }],
      'svelte/html-closing-bracket-spacing': ['error', {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always',
      }],
      'svelte/indent': ['error', {
        indent: 2,
        switchCase: 1,
      }],
      'svelte/max-attributes-per-line': ['error', {
        multiline: 1,
        singleline: 3,
      }],
      'svelte/mustache-spacing': ['error', {
        textExpressions: 'never',
        attributesAndProps: 'never',
        directiveExpressions: 'never',
        tags: {
          openingBrace: 'never',
          closingBrace: 'never',
        },
      }],
      'svelte/no-spaces-around-equal-signs-in-attribute': 'error',
      'svelte/prefer-class-directive': 'error',
      'svelte/prefer-style-directive': 'error',
      'svelte/shorthand-attribute': 'error',
      'svelte/shorthand-directive': 'error',
      'svelte/sort-attributes': ['error', {
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
      }],
      'svelte/spaced-html-comment': ['error', 'always'],
    },
  },
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      // Method chaining and arrow functions
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', {
        before: true,
        after: true,
      }],

      // Object and array formatting
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: {
          multiline: true,
          minProperties: 3,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 3,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
      }],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
      '@stylistic/array-element-newline': ['error', {
        ArrayExpression: 'consistent',
        ArrayPattern: { minItems: 3 },
      }],

      // Function formatting
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],

      // Template literals and operators
      '@stylistic/template-curly-spacing': ['error', 'never'],
      '@stylistic/operator-linebreak': ['error', 'before'],

      // Semicolons and commas
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error', {
        before: false,
        after: true,
      }],
    },
  },
  { ignores: ['build/', '.svelte-kit/', 'dist/'] },
);
