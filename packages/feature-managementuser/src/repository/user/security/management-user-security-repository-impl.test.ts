import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementUserSecurityRepositoryImpl } from '@/repository/user/security/management-user-security-repository-impl'
import type { ManagementUserSecurityApi } from '@/network/api/user/security/management-user-security-api'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementUserSecurityRepositoryImpl', () => {
  let mockApi: ManagementUserSecurityApi
  let repository: ManagementUserSecurityRepositoryImpl

  beforeEach(() => {
    vi.clearAllMocks()

    mockApi = {
      disableTotp: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as ManagementUserSecurityApi

    repository = new ManagementUserSecurityRepositoryImpl(mockApi)
  })

  it('delegates disableTotp to API', async () => {
    const result = await repository.disableTotp('usr_1' as UserId)
    expect(mockApi.disableTotp).toHaveBeenCalledWith('usr_1')
    expect(isSuccess(result)).toBe(true)
  })
})
