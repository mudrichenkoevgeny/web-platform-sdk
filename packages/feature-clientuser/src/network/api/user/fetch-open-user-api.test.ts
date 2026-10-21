import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenUserApi } from '@/network/api/user/fetch-open-user-api'
import { createTestUserPrivatePayload, OpenUserRoutes, TEST_USER_ID, toUserIdOrThrow, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenUserApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenUserApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenUserApi(mockHttpClient)
  })

  it('dispatches getUser request', async () => {
    const mockUserPayload = createTestUserPrivatePayload({ id: toUserIdOrThrow(TEST_USER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const userResult = await api.getUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.GET_USER
    )
    expect(userResult).toEqual({ success: true, data: mockUserPayload })
  })

  it('dispatches scheduleUserDeletion request', async () => {
    const mockUserPayload = createTestUserPrivatePayload({
      id: toUserIdOrThrow(TEST_USER_ID),
      account_status: UserAccountStatus.PENDING_DELETION
    })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const scheduledDeletionResult = await api.scheduleUserDeletion()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.SCHEDULE_DELETION,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(scheduledDeletionResult).toEqual({ success: true, data: mockUserPayload })
  })

  it('dispatches restoreUser request', async () => {
    const mockUserPayload = createTestUserPrivatePayload({
      id: toUserIdOrThrow(TEST_USER_ID),
      account_status: UserAccountStatus.ACTIVE
    })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const restoredUserResult = await api.restoreUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.RESTORE_USER,
      expect.objectContaining({ method: 'POST' })
    )
    expect(restoredUserResult).toEqual({ success: true, data: mockUserPayload })
  })
})
