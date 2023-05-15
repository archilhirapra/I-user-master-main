/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
// module.exports = {
//   content: ["./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     fontFamily: {
//       sans: ["Inter", ...defaultTheme.fontFamily.sans],
//     },
//     container: {
//       center: true,
//     },
//     extend: {
//       colors: {
//         dark: "#0A1931",
//         primary: "#185ADB",
//       },
//       boxShadow: {
//         light: "0 1px 20px rgba(0,0,0,0.08)",
//       },
//     },
//   },
//   plugins: [require("tailwind-scrollbar")],
// };

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    container: false,
  },
  theme: {
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        dark: "#0A1931",
        primary: "#1662D2",
        body: colors.gray["900"],
        dim: colors.gray["500"],
      },

      borderColor: ({ theme }) => ({
        DEFAULT: theme.colors.gray["100"],
      }),
      boxShadow: {
        light: "0 1px 20px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/line-clamp")],
};
