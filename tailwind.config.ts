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
				planner: {
					grid: 'hsl(var(--planner-grid))',
					cell: 'hsl(var(--planner-cell))',
					header: 'hsl(var(--planner-header))',
				},
				info: {
					DEFAULT: 'hsl(var(--info-background))',
					foreground: 'hsl(var(--info-foreground))',
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
				'past-year': {
					100: 'hsl(var(--past-year-100))',
					150: 'hsl(var(--past-year-150))',
					200: 'hsl(var(--past-year-200))',
					300: 'hsl(var(--past-year-300))',
					400: 'hsl(var(--past-year-400))',
					500: 'hsl(var(--past-year-500))',
					600: 'hsl(var(--past-year-600))',
					700: 'hsl(var(--past-year-700))',
					800: 'hsl(var(--past-year-800))',
					900: 'hsl(var(--past-year-900))',
				},
				'health-check': {
					100: 'hsl(var(--health-check-100))',
					150: 'hsl(var(--health-check-150))',
					200: 'hsl(var(--health-check-200))',
					300: 'hsl(var(--health-check-300))',
					400: 'hsl(var(--health-check-400))',
					500: 'hsl(var(--health-check-500))',
					600: 'hsl(var(--health-check-600))',
					700: 'hsl(var(--health-check-700))',
					800: 'hsl(var(--health-check-800))',
					900: 'hsl(var(--health-check-900))',
				},
				'new-year': {
					100: 'hsl(var(--new-year-100))',
					150: 'hsl(var(--new-year-150))',
					200: 'hsl(var(--new-year-200))',
					300: 'hsl(var(--new-year-300))',
					400: 'hsl(var(--new-year-400))',
					500: 'hsl(var(--new-year-500))',
					600: 'hsl(var(--new-year-600))',
					700: 'hsl(var(--new-year-700))',
					800: 'hsl(var(--new-year-800))',
					900: 'hsl(var(--new-year-900))',
				},
				'plan-terminate': {
					100: 'hsl(var(--plan-terminate-100))',
					150: 'hsl(var(--plan-terminate-150))',
					200: 'hsl(var(--plan-terminate-200))',
					300: 'hsl(var(--plan-terminate-300))',
					400: 'hsl(var(--plan-terminate-400))',
					500: 'hsl(var(--plan-terminate-500))',
					600: 'hsl(var(--plan-terminate-600))',
					700: 'hsl(var(--plan-terminate-700))',
					800: 'hsl(var(--plan-terminate-800))',
					900: 'hsl(var(--plan-terminate-900))',
				},
				'last-slide': {
					100: 'hsl(var(--last-slide-100))',
					150: 'hsl(var(--last-slide-150))',
					200: 'hsl(var(--last-slide-200))',
					300: 'hsl(var(--last-slide-300))',
					400: 'hsl(var(--last-slide-400))',
					500: 'hsl(var(--last-slide-500))',
					600: 'hsl(var(--last-slide-600))',
					700: 'hsl(var(--last-slide-700))',
					800: 'hsl(var(--last-slide-800))',
					900: 'hsl(var(--last-slide-900))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
