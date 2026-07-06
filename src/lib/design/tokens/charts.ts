import { elevation } from './elevation';

export const chartConfig = {
  margin: { top: 10, right: 10, bottom: 10, left: 10 },
  grid: {
    strokeDasharray: '3 3',
    stroke: 'hsl(var(--border))',
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'hsl(var(--popover))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
      boxShadow: elevation[2].light,
    },
  },
} as const;
