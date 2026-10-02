import React, { useMemo } from 'react'
import { SdkProvider } from '../context/SdkProvider'
import { ThemeProvider } from '../theme/ThemeContext'
import { CommonComponent } from '../di/CommonComponent'
import { createMockCommonComponent } from '../mock/di/CommonComponentMock'

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
   * Default theme mode ('light', 'dark', or 'system').
   */
  defaultMode?: 'light' | 'dark' | 'system'
}

/**
 * React test harness component providing SDK and Theme contexts for component testing and Storybook previews.
 *
 * @param props - Test harness configuration properties
 * @returns JSX element wrapping children with SdkProvider and ThemeProvider
 */
export const ComponentTestHarness: React.FC<ComponentTestHarnessProps> = ({
  children,
  component,
  defaultMode = 'light'
}) => {
  const sdkComponent = useMemo(
    () => component ?? createMockCommonComponent(),
    [component]
  )

  return (
    <SdkProvider component={sdkComponent}>
      <ThemeProvider defaultMode={defaultMode}>{children}</ThemeProvider>
    </SdkProvider>
  )
}
