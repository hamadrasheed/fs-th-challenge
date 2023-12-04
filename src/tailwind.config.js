const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.tsx",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        danger: "#dc3545",
        warning: "#ffc107",
        success: "#198754",
        secondary: "#6c757d",
        primary: {
          50: "#78c2d1",
          100: "#63abb9",
          200: "#41859c",
          300: "#397a8f",
          400: "#347387",
          500: "#2e6c80",
          600: "#295e70",
          700: "#23505f",
          800: "#1e434f",
          900: "#18363f",
        },
        secondary: {
          200: "#819498",
          400: "#202e31",
          800: "#1a2628",
          900: "#131d1f",
        },
        navy: {
          50: "#e7e9ef",
          100: "#c2c9d6",
          200: "#a3adc2",
          300: "#697a9b",
          400: "#5c6b8a",
          450: "#465675",
          500: "#384766",
          600: "#313e59",
          700: "#26334d",
          750: "#222e45",
          800: "#202b40",
          900: "#192132",
        },
      },
      boxShadow: {
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
      },
      outline: {
        blue: "2px solid rgba(0, 112, 244, 0.5)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5715" }],
        base: ["1rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        lg: ["1.125rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
        "3xl": ["1.88rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
        "4xl": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      screens: {
        xs: "480px",
      },
      borderWidth: {
        3: "3px",
      },
      minWidth: {
        36: "9rem",
        44: "11rem",
        56: "14rem",
        60: "15rem",
        72: "18rem",
        80: "20rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        60: "60",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    // add custom variant for expanding sidebar
    plugin(({ addVariant, e }) => {
      addVariant("sidebar-expanded", ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) =>
            `.sidebar-expanded .${e(
              `sidebar-expanded${separator}${className}`
            )}`
        );
      });
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    }),
  ],
};
