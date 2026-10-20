import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementUserRepositoryImpl } from '@/repository/user/management-user-repository-impl'
import { ManagementUserApiMock } from '@/mock/network/api/user/management-user-api-mock'
import { createTestUserPrivatePayload, createTestPagedResultPayload, SortOrder, TEST_EMAIL, TEST_USER_ID, toUserIdOrThrow, UserRole, createTestCreateUserRequest, createTestUpdateUserRequest } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementUserRepositoryImpl', () => {
  let mockApi: ManagementUserApiMock
  let repository: ManagementUserRepositoryImpl

  const mockUserPayload = createTestUserPrivatePayload({
    id: toUserIdOrThrow(TEST_USER_ID),
    role: UserRole.ADMIN
  })

  beforeEach(() => {
    mockApi = new ManagementUserApiMock()
    mockApi.createUserResult = appResultSuccess(mockUserPayload)
    mockApi.getUsersResult = appResultSuccess(createTestPagedResultPayload({
      items: [mockUserPayload],
      total_count: 1,
      page_number: 1,
      page_size: 10,
      total_pages: 1
    }))
    mockApi.getUserResult = appResultSuccess(mockUserPayload)
    mockApi.updateUserResult = appResultSuccess(undefined)
    mockApi.deleteUserResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'createUser').mockImplementation(mockApi.createUser.bind(mockApi))
    vi.spyOn(mockApi, 'getUsers').mockImplementation(mockApi.getUsers.bind(mockApi))
    vi.spyOn(mockApi, 'getUser').mockImplementation(mockApi.getUser.bind(mockApi))
    vi.spyOn(mockApi, 'updateUser').mockImplementation(mockApi.updateUser.bind(mockApi))
    vi.spyOn(mockApi, 'deleteUser').mockImplementation(mockApi.deleteUser.bind(mockApi))

    repository = new ManagementUserRepositoryImpl(mockApi)
  })

  it('delegates createUser to API and maps result', async () => {
    const request = createTestCreateUserRequest({ email: TEST_EMAIL })
    const result = await repository.createUser(request)
    expect(mockApi.createUser).toHaveBeenCalledWith(request)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getUsers to API and maps paged result', async () => {
    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userRoles: [],
      accountStatuses: [],
      accountStatusesOnRestore: [],
      accountLockoutTypes: [],
      authorityLevelFrom: null,
      authorityLevelTo: null,
      isTotpEnabled: null,
      permissionCodes: []
    }
    const result = await repository.getUsers(params)
    expect(mockApi.getUsers).toHaveBeenCalledWith(params)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getUser to API and maps result', async () => {
    const result = await repository.getUser(toUserIdOrThrow(TEST_USER_ID))
    expect(mockApi.getUser).toHaveBeenCalledWith(TEST_USER_ID)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates updateUser to API', async () => {
    const request = createTestUpdateUserRequest({ email: 'new@example.com' })
    const result = await repository.updateUser(toUserIdOrThrow(TEST_USER_ID), request)
    expect(mockApi.updateUser).toHaveBeenCalledWith(TEST_USER_ID, request)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteUser to API', async () => {
    const result = await repository.deleteUser(toUserIdOrThrow(TEST_USER_ID))
    expect(mockApi.deleteUser).toHaveBeenCalledWith(TEST_USER_ID)
    expect(isSuccess(result)).toBe(true)
  })
})
