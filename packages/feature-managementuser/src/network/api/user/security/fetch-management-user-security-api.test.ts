import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserSecurityApi } from '@/network/api/user/security/fetch-management-user-security-api'
import { toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementUserSecurityApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementUserSecurityApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementUserSecurityApi(mockHttpClient)
  })

  it('dispatches disableTotp request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.disableTotp(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('user_id=usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
