import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config({
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  ignores: ['./eslint.config.mjs', 'commands.js'],
  extends: [eslint.configs.recommended, importPlugin.flatConfigs.recommended, tseslint.configs.recommended],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      sourceType: 'module',
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  settings: {
    'import/extensions': ['.ts', 'js'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        paths: ['./src'],
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'no-fallthrough': 'off',
    'no-var': 'error',

    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': [2, { ignore: ['^love'] }],
    'import/no-cycle': [2, { ignoreExternal: true }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/unbound-method': [
      'error',
      {
        ignoreStatic: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
    '@typescript-eslint/ban-types': 'off',
    eqeqeq: ['error', 'smart'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'error',
  },
});
