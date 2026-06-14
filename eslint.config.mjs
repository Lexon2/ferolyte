import js from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import parserTs from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintPluginPrettierRecommended,
    ],
    plugins: {
      '@stylistic/ts': stylisticTs,
      'import-x': eslintPluginImportX,
      'unused-imports': unusedImports,
    },
    rules: {
      curly: ['error', 'multi-line'],
      'no-unused-vars': 'off',
      'no-empty': 'off',
      // @TODO: Remove this once we have a better way to handle types
      '@typescript-eslint/no-explicit-any': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-empty-object-type': [
        'off',
        { allowInterfaces: 'with-single-extends' },
      ],
      'prettier/prettier': [
        'off',
        {
          endOfLine: 'crlf',
        },
      ],
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // 'import-x/order': [
      //   'error',
      //   {
      //     groups: ['builtin', 'external', 'internal'],
      //     pathGroups: [
      //       {
      //         pattern: '@minecraft/server',
      //         group: 'external',
      //         position: 'before',
      //       },
      //     ],
      //     pathGroupsExcludedImportTypes: ['@minecraft/server'],
      //     'newlines-between': 'always',
      //     alphabetize: {
      //       order: 'asc',
      //       caseInsensitive: true,
      //     },
      //   },
      // ],
      '@stylistic/ts/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'any', prev: 'if', next: 'return' },
      ],
    },
  },
  {
    ignores: ['build/**/*.js'],
  },
);
