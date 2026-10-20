import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserApi } from '@/network/api/user/fetch-management-user-api'
import { createTestUserPrivatePayload, ManagementUsersRoutes, ManagementUserListParamsParser, UserApiPaths, SortOrder, TEST_EMAIL, TEST_USER_ID, toUserIdOrThrow, createTestPagedResultPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
import type { CreateUserParams, UpdateUserParams } from '@/repository/user/management-user-repository'

describe('FetchManagementUserApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementUserApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementUserApi(mockHttpClient)
  })

  it('dispatches createUser request', async () => {
    const mockPayload = createTestUserPrivatePayload({ id: toUserIdOrThrow(TEST_USER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const createUserParams: CreateUserParams = { email: TEST_EMAIL, password: 'secret' }
    const result = await api.createUser(createUserParams)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUsersRoutes.CREATE_USER,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches getUsers request with query params', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    const expectedUserListPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

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
    const result = await api.getUsers(params)

    const expectedUrl = appendQueryParamsToPath(
      ManagementUsersRoutes.GET_USERS,
      ManagementUserListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedUserListPagedResult })
  })

  it('dispatches getUser request', async () => {
    const mockPayload = createTestUserPrivatePayload({ id: toUserIdOrThrow(TEST_USER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.getUser(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUsersRoutes.GET_USER.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID)
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches updateUser request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const updateUserParams: UpdateUserParams = { authorityLevel: 10 }
    const result = await api.updateUser(userId, updateUserParams)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUsersRoutes.UPDATE_USER.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      expect.objectContaining({ method: 'PATCH' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteUser request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteUser(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUsersRoutes.DELETE_USER.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
