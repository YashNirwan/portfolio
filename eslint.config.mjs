import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored tooling, not this project's source. These are third-party
    // minified bundles that shipped with the impeccable design linter;
    // linting them produced 94 warnings about code nobody here will edit.
    ".github/skills/**",
  ]),
]);

export default eslintConfig;
