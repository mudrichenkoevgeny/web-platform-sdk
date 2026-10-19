import React, { useMemo } from 'react'
import { CommonLocales } from '@mudrichenkoevgeny/shared-foundation'
import { SdkProvider } from '@/context/SdkProvider'
import { LocalizationProvider } from '@/context/LocalizationContext'
import { ThemeMode, ThemeProvider } from '@/theme/ThemeContext'
import type { CommonComponent } from '@/di/common-component'
import { createMockCommonComponent } from '@/mock/di/common-component-mock'

/**
 * Props for the {@link ComponentTestHarness} React wrapper.
 */
export interface ComponentTestHarnessProps {
  /**
   * React child elements to render inside the SDK provider context.
   */
  children: React.ReactNode
  /**
   * Optional custom {@link CommonComponent} instance for test overrides.
   */
  component?: CommonComponent
  /**
   * Default theme mode (e.g. {@link ThemeMode.LIGHT}, {@link ThemeMode.DARK}, or {@link ThemeMode.SYSTEM}).
   */
  defaultMode?: ThemeMode
  /**
   * Optional locale tag. Defaults to {@link CommonLocales.ENGLISH}.
   */
  locale?: string
}

/**
 * React test harness component providing SDK, Localization, and Theme contexts for component testing and Storybook previews.
 *
 * @param props - Test harness configuration properties
 * @returns JSX element wrapping children with SdkProvider, LocalizationProvider and ThemeProvider
 */
export const ComponentTestHarness: React.FC<ComponentTestHarnessProps> = ({
  children,
  component,
  defaultMode = ThemeMode.LIGHT,
  locale = CommonLocales.ENGLISH
}) => {
  const sdkComponent = useMemo(
    () => component ?? createMockCommonComponent(),
    [component]
  )

  return (
    <SdkProvider component={sdkComponent}>
      <LocalizationProvider locale={locale}>
        <ThemeProvider defaultMode={defaultMode}>{children}</ThemeProvider>
      </LocalizationProvider>
    </SdkProvider>
  )
}
