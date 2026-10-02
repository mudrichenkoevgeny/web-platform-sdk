import React, { useMemo } from 'react'
import { SdkProvider } from '../context/SdkProvider'
import { ThemeProvider } from '../theme/ThemeContext'
import { CommonComponent } from '../di/CommonComponent'
import { createInMemoryEncryptedSettings } from '../mock/EncryptedSettingsMock'
import { AccessTokenProviderMock } from '../mock/AccessTokenProviderMock'

export interface ComponentTestHarnessProps {
  children: React.ReactNode
  component?: CommonComponent
  defaultMode?: 'light' | 'dark' | 'system'
}

export const createMockCommonComponent = (): CommonComponent => {
  const settings = createInMemoryEncryptedSettings()
  const tokenProvider = new AccessTokenProviderMock('mock-token')
  const component = new CommonComponent({
    encryptedSettings: settings,
    baseUrl: 'https://api.example.com',
    webSocketPath: '/ws',
    accessTokenProvider: tokenProvider
  })
  component.init()
  return component
}

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
