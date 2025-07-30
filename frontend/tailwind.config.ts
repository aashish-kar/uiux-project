import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
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
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				luxury: {
					gold: 'hsl(var(--luxury-gold))',
					'gold-light': 'hsl(var(--luxury-gold-light))',
					'gold-dark': 'hsl(var(--luxury-gold-dark))',
					silver: 'hsl(var(--luxury-silver))',
					'silver-light': 'hsl(var(--luxury-silver-light))',
					'silver-dark': 'hsl(var(--luxury-silver-dark))',
					black: 'hsl(var(--luxury-black))',
					'black-light': 'hsl(var(--luxury-black-light))',
					white: 'hsl(var(--luxury-white))',
				}
			},
			fontFamily: {
				playfair: ['Playfair Display', 'serif'],
				inter: ['Inter', 'sans-serif'],
			},
			backgroundImage: {
				'luxury-gradient': 'var(--luxury-gradient)',
				'luxury-gradient-subtle': 'var(--luxury-gradient-subtle)',
				'glass-gradient': 'var(--glass-gradient)',
			},
			boxShadow: {
				'luxury': 'var(--luxury-shadow)',
				'luxury-glow': 'var(--luxury-glow)',
				'glass': 'var(--glass-shadow)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { opacity: '0', transform: 'translateX(100px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'luxury-glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsla(45, 90%, 65%, 0.3)' },
					'50%': { boxShadow: '0 0 40px hsla(45, 90%, 65%, 0.6)' }
				},
				'watch-tick': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(6deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'parallax-slow': {
					'0%': { transform: 'translateY(0px)' },
					'100%': { transform: 'translateY(-50px)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s var(--animation-smooth)',
				'fade-in-up': 'fade-in-up 0.8s var(--animation-smooth)',
				'slide-in-right': 'slide-in-right 0.6s var(--animation-smooth)',
				'luxury-glow': 'luxury-glow 3s ease-in-out infinite',
				'watch-tick': 'watch-tick 1s ease-in-out infinite alternate',
				'float': 'float 6s ease-in-out infinite',
				'parallax-slow': 'parallax-slow 1s linear infinite',
				'shimmer': 'shimmer 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
