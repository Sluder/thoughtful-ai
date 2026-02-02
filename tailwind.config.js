const colors = require('tailwindcss/colors');

module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            neutral: colors.neutral,
            black: colors.black,
            white: colors.white,
            emerald: colors.emerald,
            indigo: colors.indigo,
            yellow: colors.yellow,
            red: colors.red,
            orange: colors.orange,
            slate: colors.slate,
            amber: colors.amber,
        },
    },
};
