import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: ["light"],
  },
  theme: {
    extend: {
      borderWidth: {
        "1": "1px",
      },

      colors: {
        primary: "#EFC440",
        "dashbord-bg": "#FCFCFC",
        option: "#F7F7F7",
        "top-queue-bg": "#EFC440",
        "active-tab": "#fdf7ea",
        "deactivate-color": "#F0F0F0",
        "add-bg": "#f2d065",
        "gray-1": "#ACACAC",
        "gray-2": "#EFEFEF",
        "gray-3": "#939393",
        "gray-4": "#D9D9D9",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderColor: {
        red: "#DC143C",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
