import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // FinTrack fetches data client-side on mount in many pages (IPO list,
      // money ledger, dashboard, reports, etc.) using the standard
      // `useEffect(() => { load() }, [load])` pattern. This rule is aimed at
      // React Compiler / Suspense-based data fetching and flags even the
      // routine "mounted" flag pattern (e.g. theme-toggle), so it's kept as
      // a warning rather than a build-breaking error.
      "react-hooks/set-state-in-effect": "warn",
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
