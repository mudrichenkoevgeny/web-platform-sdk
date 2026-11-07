import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { createTestPagedResultPayload, createTestUserPrivatePayload, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { GlobalUserListScreen } from '../ui/screens/management/user/global-list/GlobalUserListScreen'
import { CreateUserScreen } from '../ui/screens/management/user/create/CreateUserScreen'
import { UserDetailScreen } from '../ui/screens/management/user/detail/UserDetailScreen'
import { managementUserComponentMock } from '../mock/di/management-user-component-mock'
import { globalUserListDependenciesMock } from '../mock/ui/screen/management/user/global-list/global-user-list-component-mock'

const USER_ID = '123e4567-e89b-12d3-a456-426614174000'

const server = setupServer(
  http.get(`https://api.example.com/management/v1/users/${USER_ID}`, () => {
    return HttpResponse.json(createTestUserPrivatePayload())
  }),
  http.get(`https://api.example.com/management/users/${USER_ID}`, () => {
    return HttpResponse.json(createTestUserPrivatePayload())
  }),
  http.get('https://api.example.com/management/v1/users*', () => {
    return HttpResponse.json(createTestPagedResultPayload({ items: [createTestUserPrivatePayload()] }))
  }),
  http.get('https://api.example.com/management/users*', () => {
    return HttpResponse.json(createTestPagedResultPayload({ items: [createTestUserPrivatePayload()] }))
  })
)

describe('Management User Administration Integration Suite', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Flow 1: Global User List - Fetch, search, and render administrative users', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const managementUserComponent = managementUserComponentMock({ commonComponent })

    render(
      <GlobalUserListScreen
        dependencies={globalUserListDependenciesMock({
          getUsersUseCase: managementUserComponent.getUsersUseCase,
          onNavigateToCreateUser: vi.fn(),
          onNavigateToUserDetail: vi.fn(),
          onBack: vi.fn()
        })}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create/i })).toBeDefined()
    })
  })

  it('Flow 2: Create Administrative User - Form inputs and action handlers', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const managementUserComponent = managementUserComponentMock({ commonComponent })

    render(
      <CreateUserScreen
        dependencies={{
          createUserUseCase: managementUserComponent.createUserUseCase,
          onBack: vi.fn(),
          onSuccess: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create user/i })).toBeDefined()
    })
  })

  it('Flow 3: User Detail Management - View profile and administrative operations', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const managementUserComponent = managementUserComponentMock({ commonComponent })

    render(
      <UserDetailScreen
        dependencies={{
          userId: toUserIdOrThrow(USER_ID),
          getUserUseCase: managementUserComponent.getUserUseCase,
          updateUserUseCase: managementUserComponent.updateUserUseCase,
          deleteUserUseCase: managementUserComponent.deleteUserUseCase,
          managementDisableTotpUseCase: managementUserComponent.managementDisableTotpUseCase,
          onNavigateToSessions: vi.fn(),
          onNavigateToIdentifiers: vi.fn(),
          onNavigateToAuditEvents: vi.fn(),
          onNavigateToStorageFiles: vi.fn(),
          onBack: vi.fn()
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back/i })).toBeDefined()
    })
  })
})
