import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  createTestUserPrivatePayload,
  createTestTotpRecoveryCodesPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TotpMainScreen, TotpRecoveryCodesScreen, TotpMainTestTags, TotpRecoveryCodesTestTags } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '../mock/di/client-user-component-mock'

const server = setupServer(
  http.get('https://api.example.com/user', () => {
    return HttpResponse.json(createTestUserPrivatePayload())
  }),
  http.post('https://api.example.com/user/totp/setup', () => {
    return HttpResponse.json({
      enabled: false,
      qr_code_url: 'otpauth://totp/TestApp?secret=JBSWY3DPEHPK3PXP',
      secret: 'JBSWY3DPEHPK3PXP'
    })
  }),
  http.get('https://api.example.com/user/totp/recovery-codes', () => {
    return HttpResponse.json(createTestTotpRecoveryCodesPayload())
  })
)

describe('Client User TOTP / 2FA Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: TOTP Main Screen - View 2FA setup status and secret', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    render(
      <TotpMainScreen
        dependencies={{
          userRepository: clientUserComponent.userRepository,
          setupTotpUseCase: clientUserComponent.setupTotpUseCase,
          enableTotpUseCase: clientUserComponent.enableTotpUseCase,
          disableTotpUseCase: clientUserComponent.disableTotpUseCase,
          onNavigateToRecoveryCodes: vi.fn(),
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(TotpMainTestTags.TITLE)).toBeDefined()
    })
  })

  it('Flow 2: TOTP Recovery Codes - Fetch and display backup codes', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    render(
      <TotpRecoveryCodesScreen
        dependencies={{
          getRecoveryCodesUseCase: clientUserComponent.getRecoveryCodesUseCase,
          regenerateRecoveryCodesUseCase: clientUserComponent.regenerateRecoveryCodesUseCase,
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(TotpRecoveryCodesTestTags.TITLE)).toBeDefined()
    })
  })
})
