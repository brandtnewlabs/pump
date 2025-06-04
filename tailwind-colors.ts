import { green, neutral, red, white, yellow } from "tailwindcss/colors";

// Created with https://uicolors.app/generate/1F1F1F based on #1F1F1F
// const carbon = {
//   "50": "#f5f5f5",
//   "100": "#e0e0e0",
//   "200": "#bdbdbd",
//   "300": "#9e9e9e",
//   "400": "#757575",
//   "500": "#555555",
//   "600": "#3c3c3c",
//   "700": "#2f2f2f",
//   "800": "#1f1f1f",
//   "900": "#191919",
//   "950": "#111111",
// };

// Created with https://uicolors.app/generate/55D292 based on #55d292
const brand = {
  "50": "#edfcf3",
  "100": "#d3f8e0",
  "200": "#abefc6",
  "300": "#74e1a6",
  "400": "#55d292", // Main brand color
  "500": "#18b167",
  "600": "#0c8f53",
  "700": "#0a7246",
  "800": "#0a5b38",
  "900": "#094b2f",
  "950": "#042a1b",
};

const primary = brand;
const base = neutral;

const error = red;
const warning = yellow;
const success = green;

const background = {
  primary: base[950],
  secondary: base[900],
  tertiary: base[800],
  brand: primary[400],
  inverse: white,
};

const text = {
  primary: base[50],
  secondary: base[200],
  tertiary: base[500],
  brand: primary[400],
  brandDark: primary[900],
  inverse: white,
};

export default {
  primary,
  base,
  error,
  warning,
  success,
  white,

  background,
  text,
};
