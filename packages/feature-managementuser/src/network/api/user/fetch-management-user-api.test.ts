import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiException, HttpClientMock, appendQueryParamsToPath, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserApi } from '@/network/api/user/fetch-management-user-api'
import {
  createTestUserPrivatePayload,
  createTestApiErrorResponse,
  ManagementUsersRoutes,
  ManagementUserListParamsParser,
  UserApiPaths,
  SortOrder,
  TEST_EMAIL,
  TEST_USER_ID,
  toUserIdOrThrow,
  createTestPagedResult,
  createTestPagedResultPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { CreateUserParams, UpdateUserParams } from '@/repository/user/management-user-repository'

describe('FetchManagementUserApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementUserApi

  const userListPagedPayload = createTestPagedResultPayload({
    items: [],
    total_count: 0,
    page_number: 1,
    page_size: 10,
    total_pages: 0
  })

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementUserApi(mockHttpClient)
  })

  it('dispatches createUser request', async () => {
    const mockUserPayload = createTestUserPrivatePayload({ id: toUserIdOrThrow(TEST_USER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const createUserParams: CreateUserParams = { email: TEST_EMAIL, password: 'secret' }
    const result = await api.createUser(createUserParams)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUsersRoutes.CREATE_USER,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches getUsers request with query params', async () => {
    const expectedUserListPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(userListPagedPayload)

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
    const result = await api.getUsers(managementUserListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementUsersRoutes.GET_USERS,
      ManagementUserListParamsParser.toQueryMap(managementUserListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedUserListPagedResult })
  })

  it('dispatches getUser request', async () => {
    const mockUserPayload = createTestUserPrivatePayload({ id: toUserIdOrThrow(TEST_USER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.getUser(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUsersRoutes.GET_USER.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID)
    )
    expect(isSuccess(result)).toBe(true)
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
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deleteUser request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteUser(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUsersRoutes.DELETE_USER.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'USER_NOT_FOUND', message: 'Not found' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getUser(toUserIdOrThrow(TEST_USER_ID))

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('USER_NOT_FOUND')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getUser(toUserIdOrThrow(TEST_USER_ID))

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
