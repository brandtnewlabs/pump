import { background, text } from "./tailwind-colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background,
        text,
      },
      fontFamily: {
        "inter-regular": ["Inter-Regular", "sans-serif"],
        "inter-bold": ["Inter-Bold", "sans-serif"],
        "inter-semibold": ["Inter-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
}
