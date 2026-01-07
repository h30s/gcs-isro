/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                mission: {
                    bg: '#050505',
                    panel: '#0a0a0a',
                    border: '#1f1f1f',
                    cyan: '#00f0ff',
                    green: '#0aff00',
                    amber: '#ffaa00',
                    alert: '#ff003c',
                    text: '#e0e0e0',
                    muted: '#666666',
                }
            },
            fontFamily: {
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
            }
        },
    },
    plugins: [],
}
