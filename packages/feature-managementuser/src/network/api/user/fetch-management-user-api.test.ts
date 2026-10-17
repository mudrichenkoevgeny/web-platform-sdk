import { describe, it, expect, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserApi } from '@/network/api/user/fetch-management-user-api'
import { ManagementUsersRoutes, SortOrder, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userPrivatePayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { pagedResultPayloadMock } from '@/mock'
import type { CreateUserParams, UpdateUserParams } from '@/repository/user/management-user-repository'

describe('FetchManagementUserApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementUserApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    mockHttpClient.request = vi.fn() as any
    api = new FetchManagementUserApi(mockHttpClient)
  })

  it('dispatches createUser request', async () => {
    const mockPayload = userPrivatePayloadMock({ id: toUserIdOrThrow('usr_1') })
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const createUserParams: CreateUserParams = { email: 'user@example.com', password: 'secret' }
    const result = await api.createUser(createUserParams)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUsersRoutes.CREATE_USER,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches getUsers request with query params', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedUserListPagedResult = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    mockHttpClient.request.mockResolvedValue(mockPayload)

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

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementUsersRoutes.GET_USERS)
    )
    expect(result).toEqual({ success: true, data: expectedUserListPagedResult })
  })

  it('dispatches getUser request', async () => {
    const mockPayload = userPrivatePayloadMock({ id: toUserIdOrThrow('usr_1') })
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.getUser(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/users/usr_1')
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches updateUser request', async () => {
    const mockPayload = userPrivatePayloadMock({ id: toUserIdOrThrow('usr_1') })
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const userId = toUserIdOrThrow('usr_1')
    const updateUserParams: UpdateUserParams = { authorityLevel: 10 }
    const result = await api.updateUser(userId, updateUserParams)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/users/usr_1'),
      expect.objectContaining({ method: 'PATCH' })
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches deleteUser request', async () => {
    mockHttpClient.request.mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteUser(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/users/usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
