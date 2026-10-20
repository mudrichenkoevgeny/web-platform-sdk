import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementUserSecurityRepositoryImpl } from '@/repository/user/security/management-user-security-repository-impl'
import { ManagementUserSecurityApiMock } from '@/mock/network/api/user/security/management-user-security-api-mock'
import { TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementUserSecurityRepositoryImpl', () => {
  let mockApi: ManagementUserSecurityApiMock
  let repository: ManagementUserSecurityRepositoryImpl

  beforeEach(() => {
    mockApi = new ManagementUserSecurityApiMock()
    mockApi.disableTotpResult = appResultSuccess(undefined)
    vi.spyOn(mockApi, 'disableTotp').mockImplementation(mockApi.disableTotp.bind(mockApi))

    repository = new ManagementUserSecurityRepositoryImpl(mockApi)
  })

  it('delegates disableTotp to API', async () => {
    const result = await repository.disableTotp(toUserIdOrThrow(TEST_USER_ID))
    expect(mockApi.disableTotp).toHaveBeenCalledWith(TEST_USER_ID)
    expect(isSuccess(result)).toBe(true)
  })
})
