import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class', 'dark'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)'],
            },
            colors: {
                // ShadCN Colors - Dipertahankan
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                chart: {
                    '1': "hsl(var(--chart-1))",
                    '2': "hsl(var(--chart-2))",
                    '3': "hsl(var(--chart-3))",
                    '4': "hsl(var(--chart-4))",
                    '5': "hsl(var(--chart-5))",
                },

                // Custom Theme Colors - Ditambahkan
                bg: {
                    light: '#F8FAFC',
                    DEFAULT: '#F8FAFC',
                    dark: '#121826',
                    secondary: {
                        light: '#F1F5F9',
                        dark: '#1E293B',
                    },
                },
                navbar: {
                    light: '#1E3A8A',
                    dark: '#0F172A',
                },
                sidebar: {
                    light: '#FFFFFF',
                    dark: '#1E293B',
                    hover: {
                        light: '#F8FAFC',
                        dark: '#273549',
                    },
                    active: {
                        light: '#EFF6FF',
                        dark: '#1E40AF20',
                    },
                },
                card: {
                    light: '#FFFFFF',
                    dark: '#1E293B',
                    header: {
                        light: '#F1F5F9',
                        dark: '#0F172A',
                    },
                },
                text: {
                    primary: {
                        light: '#111827',
                        dark: '#F8FAFC',
                    },
                    secondary: {
                        light: '#4B5563',
                        dark: '#CBD5E1',
                    },
                    muted: {
                        light: '#9CA3AF',
                        dark: '#64748B',
                    },
                },
                btn: {
                    primary: {
                        DEFAULT: '#2563EB',
                        hover: '#1D4ED8',
                    },
                    secondary: {
                        light: '#F1F5F9',
                        dark: '#334155',
                        hover: {
                            light: '#E2E8F0',
                            dark: '#475569',
                        },
                    },
                    success: {
                        DEFAULT: '#10B981',
                        hover: '#059669',
                    },
                    warning: {
                        DEFAULT: '#FBBF24',
                        hover: '#F59E0B',
                    },
                    danger: {
                        DEFAULT: '#EF4444',
                        hover: '#DC2626',
                    },
                },
                status: {
                    active: '#059669',
                    upcoming: '#0EA5E9',
                    completed: '#6B7280',
                    deadline: '#DC2626',
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                float: 'float 3s ease-in-out infinite',
                shimmer: 'shimmer 2s infinite',
            },
            boxShadow: {
                'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;