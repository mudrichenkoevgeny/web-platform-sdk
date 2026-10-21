import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementUserRepositoryImpl } from '@/repository/user/management-user-repository-impl'
import type { CreateUserParams, UpdateUserParams } from '@/repository/user/management-user-repository'
import { ManagementUserApiMock } from '@/mock/network/api/user/management-user-api-mock'
import { createTestUserPrivatePayload, createTestPagedResult, SortOrder, TEST_EMAIL, TEST_USER_ID, toUserIdOrThrow, UserRole, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'

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
    mockApi.getUsersResult = appResultSuccess(createTestPagedResult({
      items: [mockUserPayload],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    }))
    mockApi.getUserResult = appResultSuccess(mockUserPayload)
    mockApi.updateUserResult = appResultSuccess(undefined)
    mockApi.deleteUserResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'createUser')
    vi.spyOn(mockApi, 'getUsers')
    vi.spyOn(mockApi, 'getUser')
    vi.spyOn(mockApi, 'updateUser')
    vi.spyOn(mockApi, 'deleteUser')

    repository = new ManagementUserRepositoryImpl(mockApi)
  })

  it('delegates createUser to API and maps result', async () => {
    const createUserRequest: CreateUserParams = { email: TEST_EMAIL, password: 'password123' }
    const createUserResult = await repository.createUser(createUserRequest)
    expect(mockApi.createUser).toHaveBeenCalledWith(createUserRequest)
    expect(isSuccess(createUserResult)).toBe(true)
  })

  it('delegates getUsers to API and maps paged result', async () => {
    const managementUserListParams = {
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
    const userListResult = await repository.getUsers(managementUserListParams)
    expect(mockApi.getUsers).toHaveBeenCalledWith(managementUserListParams)
    expect(isSuccess(userListResult)).toBe(true)
  })

  it('delegates getUser to API and maps result', async () => {
    const userResult = await repository.getUser(toUserIdOrThrow(TEST_USER_ID))
    expect(mockApi.getUser).toHaveBeenCalledWith(TEST_USER_ID)
    expect(isSuccess(userResult)).toBe(true)
  })

  it('delegates updateUser to API', async () => {
    const updateUserRequest: UpdateUserParams = { accountStatus: UserAccountStatus.ACTIVE }
    const updateUserResult = await repository.updateUser(toUserIdOrThrow(TEST_USER_ID), updateUserRequest)
    expect(mockApi.updateUser).toHaveBeenCalledWith(TEST_USER_ID, updateUserRequest)
    expect(isSuccess(updateUserResult)).toBe(true)
  })

  it('delegates deleteUser to API', async () => {
    const deleteUserResult = await repository.deleteUser(toUserIdOrThrow(TEST_USER_ID))
    expect(mockApi.deleteUser).toHaveBeenCalledWith(TEST_USER_ID)
    expect(isSuccess(deleteUserResult)).toBe(true)
  })
})
