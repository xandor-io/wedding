import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F6F1E6",
        "ivory-warm": "#FAF6EC",
        cream: "#EFE7D5",
        "sage-deep": "#4B5A3F",
        sage: "#7C8A6A",
        "sage-soft": "#A9B59A",
        blush: "#E4C7BC",
        "blush-soft": "#F0DCD2",
        "blush-rose": "#C9918B",
        ink: "#2B2A25",
        "ink-soft": "#4A473F",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        script: ["Pinyon Script", "cursive"],
        sans: ["Jost", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
