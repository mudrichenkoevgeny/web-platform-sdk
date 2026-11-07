import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { AppType, createTestUserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  UserEditScreen,
  MainUserScreen,
  UserEditTestTags,
  MainUserTestTags
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '../mock/di/client-user-component-mock'

const server = setupServer(
  http.get('https://api.example.com/user', () => {
    return HttpResponse.json(createTestUserPrivatePayload())
  }),
  http.patch('https://api.example.com/user', async () => {
    return HttpResponse.json(createTestUserPrivatePayload({ display_name: 'Updated Name' }))
  }),
  http.post('https://api.example.com/user/schedule-deletion', () => {
    return HttpResponse.json({ status: 'SCHEDULED' })
  })
)

describe('Client User Profile & Settings Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Edit User Profile - Screen initial rendering and interaction', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    render(
      <UserEditScreen
        dependencies={{
          getUserUseCase: clientUserComponent.getUserUseCase,
          selfUpdateUserUseCase: clientUserComponent.selfUpdateUserUseCase,
          validateDisplayNameUseCase: { execute: vi.fn().mockResolvedValue(appResultSuccess(undefined)) },
          validateNicknameUseCase: { execute: vi.fn().mockResolvedValue(appResultSuccess(undefined)) },
          onBack: vi.fn(),
          onSuccess: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(UserEditTestTags.TITLE)).toBeDefined()
    })
  })

  it('Flow 2: Main User Screen - Navigation and user options', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const clientUserComponent = clientUserComponentMock({ commonComponent })

    render(
      <MainUserScreen
        dependencies={{
          appType: AppType.CLIENT,
          userRepository: clientUserComponent.userRepository,
          getUserUseCase: clientUserComponent.getUserUseCase,
          logoutUseCase: clientUserComponent.logoutUseCase,
          scheduleUserDeletionUseCase: clientUserComponent.scheduleUserDeletionUseCase,
          onNavigateToLogin: vi.fn(),
          onNavigateToTotp: vi.fn(),
          onNavigateToSessions: vi.fn(),
          onNavigateToIdentifiers: vi.fn(),
          onNavigateToStorage: vi.fn(),
          onNavigateToEditUser: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(MainUserTestTags.USER_ID_TEXT)).toBeDefined()
    })
  })
})
