export const fontFamily = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
} as const;

export const fontSize = {
  'xs': ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
  'sm': ['13px', { lineHeight: '20px', letterSpacing: '0.005em' }],
  'base': ['15px', { lineHeight: '24px', letterSpacing: '0em' }],
  'lg': ['17px', { lineHeight: '28px', letterSpacing: '-0.005em' }],
  'xl': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
  '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
  '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.015em' }],
  '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
