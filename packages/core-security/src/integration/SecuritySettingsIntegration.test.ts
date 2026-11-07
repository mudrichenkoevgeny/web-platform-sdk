import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { createMockCommonComponent, isSuccess, isFailure } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SecurityComponent } from '../di/security-component'

const server = setupServer(
  http.get('*/settings/security', () => {
    return HttpResponse.json({
      open_password_policy: {
        min_length: 8,
        require_letter: true,
        require_uppercase: true,
        require_lowercase: true,
        require_digit: true,
        require_special_char: true
      },
      otp_confirmation: {
        retry_after_seconds: 60
      }
    })
  })
)

describe('Security Component Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Fetch security settings through SecurityComponent graph', async () => {
    const commonComponent = createMockCommonComponent()
    const securityComponent = new SecurityComponent({
      webSocketService: commonComponent.webSocketService,
      httpClient: commonComponent.httpClient,
      encryptedSettings: commonComponent.encryptedSettings
    })

    const result = await securityComponent.securitySettingsRepository.getOpenSecuritySettings()
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data.passwordPolicy.minLength).toBe(8)
    }
  })

  it('Flow 2: Password Validation UseCase integration', async () => {
    const commonComponent = createMockCommonComponent()
    const securityComponent = new SecurityComponent({
      webSocketService: commonComponent.webSocketService,
      httpClient: commonComponent.httpClient,
      encryptedSettings: commonComponent.encryptedSettings
    })

    // Valid password passing 8-char policy with digits/symbols
    const validResult = await securityComponent.validatePasswordUseCase.execute('ValidPass123!')
    expect(isSuccess(validResult)).toBe(true)

    // Invalid short password failing policy
    const invalidResult = await securityComponent.validatePasswordUseCase.execute('short')
    expect(isFailure(invalidResult)).toBe(true)
  })
})
