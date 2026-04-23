import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
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
