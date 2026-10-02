import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { SdkProvider, useCommonComponent, useAppErrorParser } from './SdkProvider'
import { CommonComponent } from '../di/CommonComponent'
import { createInMemoryEncryptedSettings } from '../mock/storage/EncryptedSettingsMock'
import { AccessTokenProviderMock } from '../mock/network/AccessTokenProviderMock'
import { CommonError } from '../error/model/CommonError'

describe('SdkProvider', () => {
  const createTestComponent = () => {
    const settings = createInMemoryEncryptedSettings()
    const tokenProvider = new AccessTokenProviderMock('test-token')

    const component = new CommonComponent({
      encryptedSettings: settings,
      baseUrl: 'https://api.example.com',
      webSocketPath: '/ws',
      accessTokenProvider: tokenProvider
    })
    component.init()
    return component
  }

  it('provides CommonComponent to child hooks', () => {
    const component = createTestComponent()
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <SdkProvider component={component}>{children}</SdkProvider>
    )

    const { result } = renderHook(() => useCommonComponent(), { wrapper })

    expect(result.current).toBe(component)
  })

  it('provides AppErrorParser to child hooks', () => {
    const component = createTestComponent()
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <SdkProvider component={component}>{children}</SdkProvider>
    )

    const { result } = renderHook(() => useAppErrorParser(), { wrapper })

    expect(result.current).toBeDefined()
    const parsed = result.current.parse(CommonError.unknown())
    expect(parsed).toBe('An error has occurred.')
  })

  it('throws Error if useCommonComponent is used outside of SdkProvider', () => {
    expect(() => renderHook(() => useCommonComponent())).toThrow('CommonComponent not provided! Wrap your app in <SdkProvider>.')
  })
})
