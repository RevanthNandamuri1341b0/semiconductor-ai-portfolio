/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'eda-bg': '#050505',
                'eda-panel': '#0a0a0a',
                'eda-border': '#1a1a2e',
                'eda-green': '#00FF41',
                'eda-blue': '#00D1FF',
                'eda-purple': '#BB86FC',
                'eda-amber': '#FFB700',
                'eda-red': '#FF4466',
                'eda-dim': '#1E1E2E',
                'eda-surface': '#111122',
            },
            fontFamily: {
                mono: ['"Fira Code"', 'monospace'],
            },
            animation: {
                'pulse-green': 'pulseGreen 2s ease-in-out infinite',
                'scan': 'scan 3s linear infinite',
                'glitch': 'glitch 1s steps(2) infinite',
                'flicker': 'flicker 4s infinite',
            },
            keyframes: {
                pulseGreen: {
                    '0%, 100%': { boxShadow: '0 0 5px #00FF41, 0 0 10px #00FF41' },
                    '50%': { boxShadow: '0 0 20px #00FF41, 0 0 40px #00FF41' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                glitch: {
                    '0%': { clipPath: 'inset(0 0 98% 0)', transform: 'translateX(-2px)' },
                    '25%': { clipPath: 'inset(40% 0 50% 0)', transform: 'translateX(2px)' },
                    '50%': { clipPath: 'inset(60% 0 30% 0)', transform: 'translateX(-1px)' },
                    '75%': { clipPath: 'inset(20% 0 70% 0)', transform: 'translateX(3px)' },
                    '100%': { clipPath: 'inset(0 0 98% 0)', transform: 'translateX(0)' },
                },
                flicker: {
                    '0%, 100%': { opacity: '1' },
                    '92%': { opacity: '1' },
                    '93%': { opacity: '0.8' },
                    '94%': { opacity: '1' },
                    '96%': { opacity: '0.6' },
                    '97%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
