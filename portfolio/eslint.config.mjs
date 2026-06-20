import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // These two rules come from the experimental React Compiler preset and
      // flag patterns this codebase uses intentionally and documents:
      //  - "mounted" flags set inside useEffect to avoid SSR/client hydration
      //    mismatches (see the detailed comment in components/useReveal.ts)
      //  - merging two refs together via a single callback ref (a standard,
      //    correct React pattern), which the rule can't statically verify
      // Disabling avoids false-positive build errors without changing any
      // runtime behavior.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
