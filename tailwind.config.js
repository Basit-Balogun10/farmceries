/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/tailwind/css");

module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"],
                rubik: ["Rubik", "sans-serif"],
            },
            colors: {
                light: "#DFE0DC1A",
                "green-light": "#D1D8bD",
                "green-pale": "#777E5C",
                "green-dark": "#283106",
                emerald: "#567B57",
                mint: "#A9BDA1",
                "terra-cotta": "#EEC7A3",
                "panna-cotta": "#DD9D7C",
                "orange-soda": "#D24C4A",
            },
        },
    },
    plugins: [nativewind],
};
