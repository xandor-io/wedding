import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "node_modules/**", ".superpowers/**"],
  },
  {
    rules: {
      // Stylistic — apostrophes in static JSX text render fine. The rule is
      // useful inside JSX expressions, not in prose.
      "react/no-unescaped-entities": "off",
      // Single hero venue photo uses <img> intentionally for a CSS drift
      // animation. Fine to revisit with next/image later.
      "@next/next/no-img-element": "off",
      // Fonts load via <link> in app/layout.tsx. Eventually worth migrating
      // to next/font/google (better preloading, self-hosting) but not urgent.
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default eslintConfig;
