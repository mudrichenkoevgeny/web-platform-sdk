import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, isSuccess, toErrorIdOrThrow } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionPayload } from '@mudrichenkoevgeny/shared-foundation'
import {
  ClientType,
  UserAuthProvider,
  toUserIdentifierIdOrThrow,
  toUserIdOrThrow,
  toUserSession,
  toUserSessionIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementSessionRepositoryImpl } from '@/repository/session/self-management-session-repository-impl'
import type { SessionApi, AuthStorage, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementSessionRepositoryImpl', () => {
  let mockApi: SessionApi
  let mockUserStorage: UserStorage
  let mockAuthStorage: AuthStorage
  let repository: SelfManagementSessionRepositoryImpl

  const dummySessionPayload: UserSessionPayload = {
    id: toUserSessionIdOrThrow('sess_1'),
    user_id: toUserIdOrThrow('usr_1'),
    user_role: 'staff',
    created_at: 1000,
    updated_at: 1000,
    expires_at: 2000,
    last_accessed_at: 1000,
    last_reauthenticated_at: 1000,
    identifier_id: toUserIdentifierIdOrThrow('id_1'),
    identifier: 'user@example.com',
    identifier_display_name: 'user@example.com',
    identifier_auth_provider: UserAuthProvider.EMAIL,
    client_device_info: {
      client_type: ClientType.WEB,
      language: 'en',
      device_id: null,
      device_name: 'Chrome',
      app_version: '1.0.0',
      operation_system_version: 'macOS'
    },
    user_agent: 'Mozilla',
    ip_address: '127.0.0.1',
    is_sensitive_values_masked: false
  }

  const dummySessionDomain = toUserSession(dummySessionPayload)
  const dummySessionId = toUserSessionIdOrThrow('sess_1')
  const dummySessionId2 = toUserSessionIdOrThrow('sess_2')

  const dummyError: AppError = {
    id: toErrorIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
    code: 'NETWORK_ERROR',
    isRetryable: true
  }

  beforeEach(() => {
    mockApi = {
      getSessions: vi.fn().mockResolvedValue(appResultSuccess({
        items: [dummySessionPayload],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      })),
      getSession: vi.fn().mockResolvedValue(appResultSuccess(dummySessionPayload)),
      logout: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      deleteSession: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      deleteAllOtherSessions: vi.fn().mockResolvedValue(appResultSuccess({
        deleted_session_ids: ['sess_2']
      })),
      reauthenticateSession: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as SessionApi

    mockUserStorage = {
      getUserSessionsList: vi.fn().mockResolvedValue({
        items: [dummySessionDomain],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      }),
      updateUserSessionsPayloadList: vi.fn().mockResolvedValue(undefined),
      addUserSession: vi.fn().mockResolvedValue(undefined),
      removeUserSession: vi.fn().mockResolvedValue(undefined),
      removeUserSessions: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined)
    } as unknown as UserStorage

    mockAuthStorage = {
      clearTokens: vi.fn().mockResolvedValue(undefined)
    } as unknown as AuthStorage

    repository = new SelfManagementSessionRepositoryImpl(mockApi, mockUserStorage, mockAuthStorage)
  })

  it('delegates getSessions and caches payload on network success', async () => {
    const result = await repository.getSessions(1, 10)
    expect(mockApi.getSessions).toHaveBeenCalled()
    expect(mockUserStorage.updateUserSessionsPayloadList).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('falls back to cache in getSessions on network error', async () => {
    vi.mocked(mockApi.getSessions).mockResolvedValueOnce(appResultFailure(dummyError))
    const result = await repository.getSessions(1, 10)
    expect(mockUserStorage.getUserSessionsList).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getSession and caches model on success', async () => {
    const result = await repository.getSession(dummySessionId)
    expect(mockApi.getSession).toHaveBeenCalledWith(dummySessionId)
    expect(mockUserStorage.addUserSession).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('falls back to cache in getSession on network error', async () => {
    vi.mocked(mockApi.getSession).mockResolvedValueOnce(appResultFailure(dummyError))
    const result = await repository.getSession(dummySessionId)
    expect(mockUserStorage.getUserSessionsList).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates logout and clears storage', async () => {
    const result = await repository.logout()
    expect(mockApi.logout).toHaveBeenCalled()
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteSession and removes from cache', async () => {
    const result = await repository.deleteSession(dummySessionId)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(dummySessionId)
    expect(mockUserStorage.removeUserSession).toHaveBeenCalledWith(dummySessionId)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteAllOtherSessions and removes deleted sessions from cache', async () => {
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValueOnce({
      items: [{ id: dummySessionId2 } as typeof dummySessionDomain],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    })

    const result = await repository.deleteAllOtherSessions()
    expect(mockApi.deleteAllOtherSessions).toHaveBeenCalled()
    expect(mockUserStorage.removeUserSessions).toHaveBeenCalledWith([dummySessionId2])
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates reauthenticateSession', async () => {
    const result = await repository.reauthenticateSession('mfa_1', '123456')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith({
      mfa_token: 'mfa_1',
      totp_code: '123456'
    })
    expect(isSuccess(result)).toBe(true)
  })
})
