import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        punch: {
          orange: '#E85D04',
          orangeLight: '#FF6A13',
          orangeDark: '#D14F00',
          cocoa: '#5A2E1C',
          cream: '#FFF8F2',
          dark: '#0B0B0B',
          muted: '#F4E7DA',
          border: '#E7D6C6',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #E85D04 0%, #FF6A13 100%)',
        'gradient-orange': 'linear-gradient(135deg, #E85D04 0%, #D14F00 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(232, 93, 4, 0.3)',
        'glow-lg': '0 0 40px rgba(232, 93, 4, 0.4)',
      },
    },
  },
  plugins: [],
}
export default config
