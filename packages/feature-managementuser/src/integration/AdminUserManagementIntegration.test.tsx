import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  createTestPagedResultPayload,
  createTestUserSummaryPayload,
  createTestUserPrivatePayload,
  toUserIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { GlobalUserListScreen, GlobalUserListTestTags } from '../ui/screens/management/user/global-list/GlobalUserListScreen'
import { CreateUserScreen, CreateUserTestTags } from '../ui/screens/management/user/create/CreateUserScreen'
import { UserDetailScreen, UserDetailTestTags } from '../ui/screens/management/user/detail/UserDetailScreen'
import { globalUserListDependenciesMock } from '../mock/ui/screen/management/user/global-list/global-user-list-component-mock'
import { userDetailDependenciesMock } from '../mock/ui/screen/management/user/detail/user-detail-component-mock'
import { managementUserComponentMock } from '../mock/di/management-user-component-mock'

const USER_ID = '00000000-0000-4000-8000-000000000001'

const server = setupServer(
  http.get('https://api.example.com/management/users', () => {
    return HttpResponse.json(createTestPagedResultPayload({ items: [createTestUserSummaryPayload({ id: toUserIdOrThrow(USER_ID) })] }))
  }),
  http.get(`https://api.example.com/management/users/${USER_ID}`, () => {
    return HttpResponse.json(createTestUserPrivatePayload({ id: toUserIdOrThrow(USER_ID) }))
  }),
  http.post('https://api.example.com/management/users', async () => {
    return HttpResponse.json(createTestUserPrivatePayload())
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
          deleteUserUseCase: managementUserComponent.deleteUserUseCase,
          onNavigateToCreateUser: vi.fn(),
          onNavigateToUserDetail: vi.fn(),
          onBack: vi.fn()
        })}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(GlobalUserListTestTags.TITLE)).toBeDefined()
    })
  })

  it('Flow 2: Create User Screen - Admin creates a new user account', async () => {
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
      expect(screen.getByTestId(CreateUserTestTags.TITLE)).toBeDefined()
    })
  })

  it('Flow 3: User Detail Screen - View administrative user properties', async () => {
    const commonComponent = createMockCommonComponent({ baseUrl: 'https://api.example.com' })
    const managementUserComponent = managementUserComponentMock({ commonComponent })

    render(
      <UserDetailScreen
        dependencies={userDetailDependenciesMock({
          userId: toUserIdOrThrow(USER_ID),
          getUserUseCase: managementUserComponent.getUserUseCase,
          updateUserUseCase: managementUserComponent.updateUserUseCase,
          deleteUserUseCase: managementUserComponent.deleteUserUseCase,
          onBack: vi.fn()
        })}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId(UserDetailTestTags.TITLE)).toBeDefined()
    })
  })
})
