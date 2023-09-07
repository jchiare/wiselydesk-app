import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/chat/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/chat/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/web/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/shared/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      fontFamily: {
        sans: ["InterVariable", "Inter", ...defaultTheme.fontFamily.sans]
      },
      animation: {
        "assistant-message": "blink 1s steps(5,start) infinite"
      },
      keyframes: {
        blink: {
          to: {
            visibility: "hidden"
          }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
export default config;
