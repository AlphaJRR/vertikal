import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'brand-blue': '#3B82F6',
        'brand-purple': '#9333EA',
        'gold-start': '#FFD700',
        'gold-end': '#FDB931',
      },
      animation: {
        'spring-up': 'slideUpSpring 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'pop': 'scaleInSpring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'danmaku': 'danmaku linear infinite',
        'hype': 'pulse-purple 2s infinite',
        'shine': 'shine 3s linear infinite',
        'pulse-purple': 'pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideUpSpring: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleInSpring: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        danmaku: {
          '0%': { transform: 'translateX(100%)', left: '100%' },
          '100%': { transform: 'translateX(-150%)', left: '0' },
        },
        'pulse-purple': {
          '0%': { boxShadow: '0 0 0 0 rgba(147, 51, 234, 0.7)' },
          '70%': { boxShadow: '0 0 0 6px rgba(147, 51, 234, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(147, 51, 234, 0)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

