import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import tseslint, { parser } from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
  ),
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "next"],
  }),
  perfectionist.configs["recommended-alphabetical"],
  {
    languageOptions: {
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "no-restricted-imports": ["error", { patterns: ["../*"] }],
      // Handled by the Tailwind plugin for Prettier
      "tailwindcss/classnames-order": "off",
    },
  },
  eslintConfigPrettier,
];

export default config;
