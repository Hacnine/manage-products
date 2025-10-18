// Color constants for the design system
// These colors are defined in the CSS variables and can be reused throughout the app

export const colors = {
  // Primary palette
  primary: {
    main: '#4E6E5D', // Forest green
    light: 'hsl(147 17% 45%)', // Dark mode primary
    foreground: '#EFF1F3', // Light gray
  },
  secondary: {
    main: '#AD8A64', // Tan/gold
    light: 'hsl(34 30% 43%)', // Dark mode secondary
    foreground: '#0D1821', // Dark blue-gray
  },
  accent: {
    main: '#A44A3F', // Rust red
    light: 'hsl(5 44% 55%)', // Dark mode accent
    foreground: '#EFF1F3', // Light gray
  },
  background: {
    main: '#EFF1F3', // Light gray
    dark: '#0D1821', // Dark blue-gray
  },
  foreground: {
    main: '#0D1821', // Dark blue-gray
    dark: '#EFF1F3', // Light gray
  },
} as const;

// Tailwind class mappings for easy reuse
export const colorClasses = {
  // Background gradients
  gradient: {
    primary: 'bg-gradient-to-r from-primary to-accent',
    secondary: 'bg-gradient-to-r from-secondary to-primary',
    accent: 'bg-gradient-to-r from-accent to-secondary',
    background: 'bg-gradient-to-br from-background via-secondary/20 to-primary/10',
  },

  // Card styles
  card: 'bg-card dark:bg-card rounded-xl p-6 shadow-lg border border-border dark:border-border',

  // Text colors
  text: {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    foreground: 'text-foreground',
    muted: 'text-muted-foreground',
    card: 'text-card-foreground',
  },

  // Icon backgrounds
  icon: {
    primary: 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground',
    accent: 'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground',
  },
} as const;