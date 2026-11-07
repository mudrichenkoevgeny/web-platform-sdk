import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { createTestManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageComponent } from '../di/storage-component'
import { EditStorageSettingsScreen } from '../ui/screens/settings/EditStorageSettingsScreen'

const server = setupServer(
  http.get('*/settings/storage', () => {
    return HttpResponse.json(createTestManagementStorageSettingsPayload())
  })
)

describe('Storage Module Cross-Layer Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Edit Storage Settings Screen - Fetch and render management storage configuration', async () => {
    const commonComponent = createMockCommonComponent()
    const storageComponent = new StorageComponent({
      webSocketService: commonComponent.webSocketService,
      httpClient: commonComponent.httpClient,
      encryptedSettings: commonComponent.encryptedSettings
    })

    render(
      <EditStorageSettingsScreen
        dependencies={{
          getSettingsUseCase: storageComponent.getManagementStorageSettingsUseCase,
          updateSettingsUseCase: storageComponent.updateManagementStorageSettingsUseCase,
          resetSettingsUseCase: storageComponent.resetManagementStorageSettingsUseCase,
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('EditStorageSettings_Title')).toBeDefined()
    })
  })
})
