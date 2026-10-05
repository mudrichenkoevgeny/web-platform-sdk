import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { OpenSessionRepositoryImpl } from '@/repository/session/open-session-repository-impl'
import type { AuthStorage, SessionApi, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenSessionRepositoryImpl', () => {
  let mockApi: SessionApi
  let mockUserStorage: UserStorage
  let mockAuthStorage: AuthStorage
  let repository: OpenSessionRepositoryImpl

  const dummySessionPayload = {
    id: 'sess_1',
    user_id: 'usr_1',
    user_role: 'CLIENT_USER',
    identifier: 'user@example.com',
    identifier_id: 'ident_1',
    identifier_display_name: 'User',
    identifier_auth_provider: 'EMAIL',
    device_info: {
      client_type: 'WEB',
      language: 'en',
      device_id: 'dev_1',
      device_name: 'Chrome',
      app_version: '1.0.0',
      operation_system_version: 'macOS'
    },
    user_agent: 'Mozilla/5.0',
    ip_address: '127.0.0.1',
    expires_at: 10000,
    last_accessed_at: 100,
    last_reauthenticated_at: 50,
    is_sensitive_values_masked: false,
    created_at: 10,
    updated_at: 20
  } as any

  beforeEach(() => {
    mockApi = {
      getSessions: vi.fn().mockResolvedValue(appResultSuccess({ items: [dummySessionPayload], totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 1 })),
      getSession: vi.fn().mockResolvedValue(appResultSuccess(dummySessionPayload)),
      logout: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      deleteSession: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      deleteAllOtherSessions: vi.fn().mockResolvedValue(appResultSuccess({ deletedSessionIds: ['sess_2'] })),
      reauthenticateSession: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as SessionApi

    mockUserStorage = {
      getUserSessionsList: vi.fn().mockResolvedValue({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }),
      updateUserSessionsPayloadList: vi.fn().mockResolvedValue(undefined),
      addUserSession: vi.fn().mockResolvedValue(undefined),
      removeUserSession: vi.fn().mockResolvedValue(undefined),
      removeUserSessions: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    mockAuthStorage = {
      clearTokens: vi.fn().mockResolvedValue(undefined)
    } as unknown as AuthStorage

    repository = new OpenSessionRepositoryImpl(mockApi, mockUserStorage, mockAuthStorage)
  })

  it('delegates getSessions and updates storage on success', async () => {
    const result = await repository.getSessions(1, 10)
    expect(mockApi.getSessions).toHaveBeenCalled()
    expect(mockUserStorage.updateUserSessionsPayloadList).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('falls back to cached sessions when network fails', async () => {
    vi.mocked(mockApi.getSessions).mockResolvedValue(appResultFailure(CommonError.unknown()))
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValue({ items: [{ id: 'sess_cached' } as any], totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 1 })

    const result = await repository.getSessions(1, 10)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getSession and adds to storage on success', async () => {
    const id = toUserSessionIdOrThrow('sess_1')
    const result = await repository.getSession(id)
    expect(mockApi.getSession).toHaveBeenCalledWith(id)
    expect(mockUserStorage.addUserSession).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates logout and clears storages', async () => {
    const result = await repository.logout()
    expect(mockApi.logout).toHaveBeenCalled()
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteSession and removes from storage', async () => {
    const id = toUserSessionIdOrThrow('sess_1')
    const result = await repository.deleteSession(id)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(id)
    expect(mockUserStorage.removeUserSession).toHaveBeenCalledWith(id)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteAllOtherSessions and cleans up storage', async () => {
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValue({
      items: [{ id: 'sess_2' } as any],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    })

    const result = await repository.deleteAllOtherSessions()
    expect(mockApi.deleteAllOtherSessions).toHaveBeenCalled()
    expect(mockUserStorage.removeUserSessions).toHaveBeenCalledWith(['sess_2'])
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates reauthenticateSession', async () => {
    const result = await repository.reauthenticateSession('mfa123', '654321')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith({ mfa_token: 'mfa123', totp_code: '654321' })
    expect(isSuccess(result)).toBe(true)
  })
})
