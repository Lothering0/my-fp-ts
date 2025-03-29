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
    rules: {
      "prettier/prettier": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@stylistic/js/function-call-spacing": ["error", "always"],
      "@stylistic/js/no-extra-parens": ["warn", "all"],
    },
  },
]
