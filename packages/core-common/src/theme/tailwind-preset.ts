export const sdkTailwindPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          foreground: 'hsl(var(--color-on-primary) / <alpha-value>)',
          container: 'hsl(var(--color-primary-container) / <alpha-value>)',
          onContainer: 'hsl(var(--color-on-primary-container) / <alpha-value>)'
        },
        background: {
          DEFAULT: 'hsl(var(--color-background) / <alpha-value>)',
          foreground: 'hsl(var(--color-on-background) / <alpha-value>)'
        },
        surface: {
          DEFAULT: 'hsl(var(--color-surface) / <alpha-value>)',
          foreground: 'hsl(var(--color-on-surface) / <alpha-value>)'
        },
        error: {
          DEFAULT: 'hsl(var(--color-error) / <alpha-value>)'
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
        }
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)'
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      fontFamily: {
        sans: ['var(--font-family-primary)']
      },
      fontWeight: {
        regular: 'var(--font-weight-regular)',
        bold: 'var(--font-weight-bold)'
      },
      maxWidth: {
        'core-content': '800px',
        'core-button': '400px',
        'core-form': '480px'
      },
      height: {
        'core-button': '52px',
        header: 'var(--dimen-header-height)',
        'action-button': 'var(--dimen-action-button-height)',
        row: 'var(--dimen-row-height)',
        'dialog-default': 'var(--dimen-dialog-height)'
      },
      width: {
        'dialog-default': 'var(--dimen-dialog-width)',
        'form-max': 'var(--dimen-max-form-width)',
        'content-max': 'var(--dimen-max-content-width)',
        'button-max': 'var(--dimen-max-button-width)',
        'nav-rail': 'var(--dimen-navigation-rail-width)'
      }
    }
  }
} as const
