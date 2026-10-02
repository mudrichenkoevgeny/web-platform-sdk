import { describe, it, expect } from 'vitest'
import { CommonComponent } from './CommonComponent'
import { createInMemoryEncryptedSettings } from '../mock/storage/EncryptedSettingsMock'
import { AccessTokenProviderMock } from '../mock/network/AccessTokenProviderMock'
import { CommonError } from '../error/model/CommonError'

describe('CommonComponent', () => {
  const createTestComponent = () => {
    const settings = createInMemoryEncryptedSettings()
    const tokenProvider = new AccessTokenProviderMock('test-token')

    return new CommonComponent({
      encryptedSettings: settings,
      baseUrl: 'https://api.example.com',
      webSocketPath: '/ws',
      accessTokenProvider: tokenProvider
    })
  }

  it('assembles all modules and exposes dependencies', () => {
    const component = createTestComponent()

    expect(component.commonStorage).toBeDefined()
    expect(component.externalLauncher).toBeDefined()
    expect(component.platformRepository).toBeDefined()
    expect(component.httpClient).toBeDefined()
    expect(component.webSocketService).toBeDefined()
    expect(component.commonWebSocketMessageHandler).toBeDefined()
  })

  it('throws Error when appErrorParser is accessed before init()', () => {
    const component = createTestComponent()

    expect(() => component.appErrorParser).toThrow('AppErrorParser not initialized! Call init() first.')
  })

  it('initializes appErrorParser after init() call', () => {
    const component = createTestComponent()
    component.init()

    expect(component.appErrorParser).toBeDefined()
    const parsed = component.appErrorParser.parse(CommonError.unknown())
    expect(parsed).toBe('An error has occurred.')
  })
})
