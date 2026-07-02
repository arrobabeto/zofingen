/** @type {import("tailwindcss").Config} */
const tailwind = {
  content: [
    "./app.vue",
    "./components/**/*.{vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./modules/**/*.{vue,ts}",
  ],

  theme: {
    fontFamily: {
      sans: ["Inter var", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    colors: ({ colors }) => ({
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      cyan: {
        ['400']: "#67e8f9",
        ['500']: "#06b6d4",
        ['600']: "#0e7490",
      },
    }),
    maxWidth: ({ theme, breakpoints }) => ({
      none: "none",
      fit: "fit-content",
      full: "100%",
      max: "max-content",
      min: "min-content",
      ...breakpoints(theme("screens")),
    }),
    aspectRatio: {
      auto: "auto",
      ["1/1"]: "1/1",
      ["1/2"]: "1/2",
      ["2/1"]: "2/1",
      ["4/3"]: "4/3",
      ["3/4"]: "3/4",
      ["16/9"]: "16/9",
      ["9/16"]: "9/16",
    },
    extend: {
      borderColor: { DEFAULT: "currentColor" },
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(300px, 1fr))",
      },
    },
  },

  plugins: [
    // polyfill for future pseudo selector :enter that combines :hover and :focus
    ({ addVariant }) => addVariant("enter", ["&:hover", "&:focus"]),
    // lowers specifity to allow overrides
    ({ addVariant }) => addVariant("base", "html :where(&)"),
    // style direct children
    ({ addVariant }) => addVariant("children", "& > *"),
  ],
}

module.exports = tailwind
