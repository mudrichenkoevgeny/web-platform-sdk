/**
 * Viewport size specifications for component preview stories.
 */
export const ComponentSizePreviewSpecs = {
  NAME_STANDARD: '1. Standard Component',
  NAME_NARROW: '2. Narrow Component',
  WIDTH_STANDARD: 400,
  WIDTH_NARROW: 280
} as const

/**
 * Viewport size specifications for dialog preview stories.
 */
export const DialogSizePreviewSpecs = {
  NAME_COMPACT: '1. Compact Dialog',
  NAME_MOBILE_SHEET: '2. Mobile Dialog / Sheet',
  NAME_STANDARD: '3. Standard Dialog',
  WIDTH_COMPACT: 320,
  HEIGHT_COMPACT: 480,
  WIDTH_MOBILE_SHEET: 360,
  HEIGHT_MOBILE_SHEET: 520,
  WIDTH_STANDARD: 480,
  HEIGHT_STANDARD: 520
} as const

/**
 * Viewport size specifications for screen layout preview stories.
 */
export const ScreenSizePreviewSpecs = {
  NAME_MOBILE: '1. Mobile Phone',
  NAME_TABLET: '2. Tablet',
  NAME_DESKTOP: '3. Desktop / Web',
  WIDTH_MOBILE: 360,
  HEIGHT_MOBILE: 740,
  WIDTH_TABLET: 768,
  HEIGHT_TABLET: 1024,
  WIDTH_DESKTOP: 1280,
  HEIGHT_DESKTOP: 800
} as const

/**
 * Theme specifications for storybook preview.
 */
export const ThemePreviewSpecs = {
  NAME_LIGHT: '1. Light Theme',
  NAME_DARK: '2. Dark Theme'
} as const
