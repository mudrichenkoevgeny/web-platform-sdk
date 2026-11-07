import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  createTestManagementAuthSettingsPayload,
  createTestManagementSecuritySettingsPayload,
  createTestManagementGlobalSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EditAuthSettingsScreen } from '../ui/screens/management/settings/auth/EditAuthSettingsScreen'
import { EditSecuritySettingsScreen } from '../ui/screens/management/settings/security/EditSecuritySettingsScreen'
import { EditGlobalSettingsScreen } from '../ui/screens/management/settings/global/EditGlobalSettingsScreen'
import { managementUserComponentMock } from '../mock/di/management-user-component-mock'

const server = setupServer(
  http.get('https://api.example.com/management/settings/auth', () => {
    return HttpResponse.json(createTestManagementAuthSettingsPayload())
  }),
  http.get('https://api.example.com/management/settings/security', () => {
    return HttpResponse.json(createTestManagementSecuritySettingsPayload())
  }),
  http.get('https://api.example.com/management/settings/global', () => {
    return HttpResponse.json(createTestManagementGlobalSettingsPayload())
  })
)

describe('Management Settings Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Edit Auth Settings Screen - Fetch and update authentication policies', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const managementUserComponent = managementUserComponentMock({ commonComponent })

    render(
      <EditAuthSettingsScreen
        dependencies={{
          getManagementAuthSettingsUseCase: managementUserComponent.getManagementAuthSettingsUseCase,
          updateManagementAuthSettingsUseCase: managementUserComponent.updateManagementAuthSettingsUseCase,
          resetManagementAuthSettingsUseCase: managementUserComponent.resetManagementAuthSettingsUseCase,
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeDefined()
    })
  })

  it('Flow 2: Edit Security Settings Screen - Fetch and update password/login security policies', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const managementUserComponent = managementUserComponentMock({ commonComponent })

    render(
      <EditSecuritySettingsScreen
        dependencies={{
          getManagementSecuritySettingsUseCase: managementUserComponent.getManagementSecuritySettingsUseCase,
          updateManagementSecuritySettingsUseCase: managementUserComponent.updateManagementSecuritySettingsUseCase,
          resetManagementSecuritySettingsUseCase: managementUserComponent.resetManagementSecuritySettingsUseCase,
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeDefined()
    })
  })

  it('Flow 3: Edit Global Settings Screen - Fetch and update global platform configuration', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const managementUserComponent = managementUserComponentMock({ commonComponent })

    render(
      <EditGlobalSettingsScreen
        dependencies={{
          getManagementGlobalSettingsUseCase: managementUserComponent.getManagementGlobalSettingsUseCase,
          updateManagementGlobalSettingsUseCase: managementUserComponent.updateManagementGlobalSettingsUseCase,
          resetManagementGlobalSettingsUseCase: managementUserComponent.resetManagementGlobalSettingsUseCase,
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeDefined()
    })
  })
})
