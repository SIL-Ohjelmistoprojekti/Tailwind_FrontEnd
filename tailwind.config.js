/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "index.css"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
            },
            colors: {
                'light-text': 'rgba(255, 255, 255, 0.87)',
                'light-bg': '#ffffff',
                'dark-bg': '#1a1a1a',
                'link': '#646cff',
                'link-hover': '#535bf2',
                'light-link-hover': '#747bff',
            },
            lineHeight: {
                tight: '1.1',
                relaxed: '1.5',
            },
            borderRadius: {
                lg: '8px',
            },
            transitionProperty: {
                'border': 'border-color',
            },
        },
    },
    plugins: [],
}
