import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TEST_REFRESH_TOKEN, createTestSessionTokenPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenRefreshTokenRepositoryImpl } from '@/repository/auth/refresh-token/open-refresh-token-repository-impl'
import { RefreshTokenApiMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenRefreshTokenRepositoryImpl', () => {
  let mockApi: RefreshTokenApiMock
  let repository: OpenRefreshTokenRepositoryImpl

  const mockSessionTokenPayload = createTestSessionTokenPayload()

  beforeEach(() => {
    mockApi = new RefreshTokenApiMock()
    mockApi.refreshTokenResult = appResultSuccess(mockSessionTokenPayload)
    vi.spyOn(mockApi, 'refreshToken').mockImplementation(mockApi.refreshToken.bind(mockApi))

    repository = new OpenRefreshTokenRepositoryImpl(mockApi)
  })

  it('delegates refreshToken and maps response to SessionToken', async () => {
    const result = await repository.refreshToken(TEST_REFRESH_TOKEN)
    expect(mockApi.refreshToken).toHaveBeenCalledWith({ refresh_token: TEST_REFRESH_TOKEN })
    expect(isSuccess(result)).toBe(true)
  })
})
