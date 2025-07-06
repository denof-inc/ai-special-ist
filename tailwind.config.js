/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Premium gradient-based color system - Pink/Purple/Orange/Blue mix
        premium: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        // Primary gradient system - Pink to Purple premium theme
        'gradient-primary':
          'linear-gradient(135deg, #EC4899 0%, #C084FC 50%, #8B5CF6 100%)',
        'gradient-primary-subtle':
          'linear-gradient(135deg, #FDF2F8 0%, #F3E8FF 50%, #EDE9FE 100%)',
        'gradient-primary-intense':
          'linear-gradient(135deg, #DB2777 0%, #A855F7 50%, #7C3AED 100%)',

        // Accent gradient system - Blue theme
        'gradient-accent':
          'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #60A5FA 100%)',
        'gradient-accent-subtle':
          'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
        'gradient-accent-intense':
          'linear-gradient(135deg, #1E40AF 0%, #3B82F6 25%, #60A5FA 75%, #93C5FD 100%)',

        // Hero section - Pink to Purple sophisticated
        'gradient-hero':
          'linear-gradient(135deg, #EC4899 0%, #C084FC 50%, #8B5CF6 100%)',
        'gradient-hero-overlay':
          'radial-gradient(ellipse at top, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
        'gradient-hero-mesh':
          'conic-gradient(from 0deg at 50% 50%, #EC4899 0deg, #C084FC 120deg, #8B5CF6 240deg, #EC4899 360deg)',

        // Dynamic gradients for interactive elements
        'gradient-dynamic':
          'linear-gradient(135deg, #EC4899 0%, #C084FC 50%, #8B5CF6 100%)',
        'gradient-dynamic-hover':
          'linear-gradient(135deg, #DB2777 0%, #A855F7 50%, #7C3AED 100%)',

        // Card gradients - Pink to Purple theme
        'gradient-card-primary':
          'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(192, 132, 252, 0.08) 50%, rgba(139, 92, 246, 0.05) 100%)',
        'gradient-card-accent':
          'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(96, 165, 250, 0.1) 100%)',

        // Premium effects - Pink to Purple sophisticated blend
        'gradient-premium':
          'linear-gradient(135deg, #EC4899 0%, #C084FC 33%, #8B5CF6 66%, #60A5FA 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',

        // Rich background patterns
        'gradient-rich-dark':
          'radial-gradient(ellipse at top left, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-mesh-dark':
          'radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 25%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 25%), radial-gradient(circle at 40% 60%, rgba(96, 165, 250, 0.05) 0%, transparent 25%)',
        'gradient-noise':
          'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.01) 2px, rgba(255, 255, 255, 0.01) 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            h1: {
              color: 'hsl(var(--foreground))',
            },
            h2: {
              color: 'hsl(var(--foreground))',
            },
            h3: {
              color: 'hsl(var(--foreground))',
            },
            h4: {
              color: 'hsl(var(--foreground))',
            },
            code: {
              color: 'hsl(var(--foreground))',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
