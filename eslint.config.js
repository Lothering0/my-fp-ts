import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['dist/*'] },
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_\\d*$',
          varsIgnorePattern: '^_\\d*$',
          caughtErrorsIgnorePattern: '^_\\d*$',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
]
