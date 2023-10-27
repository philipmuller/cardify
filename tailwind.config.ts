import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.3rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3rem',
    },
    extend: {
      boxShadow: {
        '3xl': '0px 4px 43px 32px rgba(206, 206, 206, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'image-0': "url('../public/1.png')",
        'image-1': "url('../public/2.png')",
        'image-2': "url('../public/3.png')",
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      rotate: {
        '0': '0deg',
        '10': '10deg',
        '20': '20deg',
        '30': '30deg',
        '40': '40deg',
        '50': '50deg',
        '60': '60deg',
        '70': '70deg',
        '80': '80deg',
        '90': '90deg',
        '100': '100deg',
      },

      rotateY: {
        '0': '0deg',
        '10': '10deg',
        '20': '20deg',
        '30': '30deg',
        '40': '40deg',
        '50': '50deg',
        '60': '60deg',
        '70': '70deg',
        '80': '80deg',
        '90': '90deg',
        '100': '100deg',
      },

      width: {
        '100': '20rem',
        '130': '28rem',
      },
      height: {
        '100': '20rem',
        '130': '28rem',
      },
      animation: {
        'gradient-x':'gradient-x 15s ease infinite',
        'gradient-y':'gradient-y 15s ease infinite',
        'gradient-xy':'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size':'400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size':'200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
              'background-size':'200% 200%',
              'background-position': 'left center'
            },
            '50%': {
              'background-size':'200% 200%',
              'background-position': 'right center'
            }
          },
          'gradient-xy': {
          '0%, 100%': {
            'background-size':'400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size':'200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
}
export default config