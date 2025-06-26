import globals from "globals"
import tseslint from "typescript-eslint"
import stylistic from "@stylistic/eslint-plugin"

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@stylistic/js": stylistic,
    },
    /* @type {import('@stylistic/eslint-plugin').RuleOptions} */
    rules: {
      "prettier/prettier": "off",
      // "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_\\d*$",
          varsIgnorePattern: "^_\\d*$",
          caughtErrorsIgnorePattern: "^_\\d*$",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@stylistic/js/function-call-spacing": ["error", "always"],
      "@stylistic/js/no-extra-parens": ["warn", "all"],
      "@stylistic/js/no-multi-spaces": [
        "error",
        {
          exceptions: {
            ImportDeclaration: true,
            ImportAttribute: true,
            Property: true,
            VariableDeclarator: true,
          },
        },
      ],
    },
  },
]
