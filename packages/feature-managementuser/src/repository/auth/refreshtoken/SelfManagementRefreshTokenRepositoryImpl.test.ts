import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfManagementRefreshTokenRepositoryImpl } from '@/repository/auth/refreshtoken/SelfManagementRefreshTokenRepositoryImpl'
import type { RefreshTokenApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementRefreshTokenRepositoryImpl', () => {
  let mockApi: RefreshTokenApi
  let repository: SelfManagementRefreshTokenRepositoryImpl

  const dummySessionTokenPayload = {
    access_token: 'access_123',
    refresh_token: 'refresh_123',
    expires_at: 3600,
    token_type: 'Bearer',
    session_id: 'sess_1',
    identifier_id: 'ident_1'
  } as any

  beforeEach(() => {
    mockApi = {
      refreshToken: vi.fn().mockResolvedValue(appResultSuccess(dummySessionTokenPayload))
    } as unknown as RefreshTokenApi

    repository = new SelfManagementRefreshTokenRepositoryImpl(mockApi)
  })

  it('delegates refreshToken and maps response to SessionToken', async () => {
    const result = await repository.refreshToken('refresh_123')
    expect(mockApi.refreshToken).toHaveBeenCalledWith({ refresh_token: 'refresh_123' })
    expect(isSuccess(result)).toBe(true)
  })
})
