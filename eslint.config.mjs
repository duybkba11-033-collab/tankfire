import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';

const nodeGlobals = {
  Buffer: 'readonly',
  __dirname: 'readonly',
  clearInterval: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
  setImmediate: 'readonly',
  setInterval: 'readonly',
  setTimeout: 'readonly'
};

const browserGlobals = {
  CustomEvent: 'readonly',
  Event: 'readonly',
  Headers: 'readonly',
  URLSearchParams: 'readonly',
  cancelAnimationFrame: 'readonly',
  clearInterval: 'readonly',
  console: 'readonly',
  document: 'readonly',
  fetch: 'readonly',
  localStorage: 'readonly',
  performance: 'readonly',
  requestAnimationFrame: 'readonly',
  setInterval: 'readonly',
  window: 'readonly'
};

export default defineConfig([
  globalIgnores(['**/node_modules/**', '**/dist/**', '**/coverage/**']),
  {
    files: [
      'backend/src/**/*.js',
      'backend/scripts/**/*.js',
      'backend/test/**/*.js',
      'backend/setup-db.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: nodeGlobals,
      sourceType: 'commonjs'
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    files: ['frontend/src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: browserGlobals,
      sourceType: 'module'
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[property.name='innerHTML']",
          message: 'Use DOM creation and textContent for untrusted data.'
        }
      ]
    }
  },
  {
    files: ['shared/**/*.mjs', 'eslint.config.mjs', 'frontend/vite.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: nodeGlobals,
      sourceType: 'module'
    },
    rules: js.configs.recommended.rules
  }
]);
