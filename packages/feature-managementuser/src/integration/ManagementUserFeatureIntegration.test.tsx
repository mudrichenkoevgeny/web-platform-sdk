import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { createTestManagementGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EditGlobalSettingsScreen } from '../ui/screens/management/settings/global/EditGlobalSettingsScreen'
import { managementUserComponentMock } from '../mock/di/management-user-component-mock'

const server = setupServer(
  http.get('https://api.example.com/management/settings/global', () => {
    return HttpResponse.json(createTestManagementGlobalSettingsPayload())
  })
)

describe('ManagementUser Feature Cross-Layer Integration', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('should fetch and display management global settings through all layers', async () => {
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
