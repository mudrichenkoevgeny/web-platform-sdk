import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserSecurityApi } from '@/network/api/user/security/fetch-management-user-security-api'
import { TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementUserSecurityApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementUserSecurityApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementUserSecurityApi(mockHttpClient)
  })

  it('dispatches disableTotp request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.disableTotp(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(`/management/users/${TEST_USER_ID}/totp`),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
