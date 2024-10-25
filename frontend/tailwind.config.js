const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      transitionDuration: {
        '100': '100ms',
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        'glow-pulse': 'glow-pulse 2s infinite',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        pressStart: ['"Press Start 2P"', 'cursive'],
        vt323: ['"VT323"', 'monospace'],
            },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(57, 255, 20, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(57, 255, 20, 1)',
          },
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(57, 255, 20, 0.7)', // Glowing shadow
      },
      colors: {
        'luminous-green': '#FACD34', // Neon green color
        // Add other custom colors if needed
      },
      borderColor: theme => ({
        ...theme('colors'),
        'luminous-green': '#FACD34',
      }),
      textColor: theme => ({
        ...theme('colors'),
        'luminous-green': '#FACD34',
      }),
    },
  },
  plugins: [
    // Remove 'animated-tailwindcss' if it's not a valid or necessary plugin
    // Ensure that 'addVariablesForColors' is correctly defined
    function addVariablesForColors({ addBase, theme }) {
      let allColors = flattenColorPalette(theme("colors"));
      let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
      );

      addBase({
        ":root": newVars,
      });
    },
  ],
};
