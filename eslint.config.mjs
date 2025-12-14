// @ts-check

import eslint from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint, { parser } from "typescript-eslint";

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    // Default ignores of eslint-config-next:
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "en-wordnet/**",
  ]),
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
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
      "import/no-anonymous-default-export": "off",
      "no-restricted-imports": ["error", { patterns: ["../*"] }],
      // Handled by the Tailwind plugin for Prettier
      "tailwindcss/classnames-order": "off",
    },
  },
  eslintConfigPrettier,
]);
