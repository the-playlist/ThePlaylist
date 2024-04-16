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
        primary: "#E6A92C",
        "dashbord-bg": "#FCFCFC",
        option: "#F7F7F7",
        "top-queue-bg": "#EFC440",
        "active-tab": "#fdf7ea",
        "add-bg": "#f2d065",
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
