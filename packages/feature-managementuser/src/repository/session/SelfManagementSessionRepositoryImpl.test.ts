import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfManagementSessionRepositoryImpl } from '@/repository/session/SelfManagementSessionRepositoryImpl'
import type { SessionApi, AuthStorage, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'

describe('SelfManagementSessionRepositoryImpl', () => {
  let mockApi: SessionApi
  let mockUserStorage: UserStorage
  let mockAuthStorage: AuthStorage
  let repository: SelfManagementSessionRepositoryImpl

  const dummySessionPayload = {
    id: 'sess_1',
    user_id: 'usr_1',
    created_at: 1000,
    updated_at: 1000,
    expires_at: 2000,
    last_accessed_at: 1000,
    last_reauthenticated_at: null,
    identifier_id: 'id_1',
    identifier: 'user@example.com',
    auth_provider: 'EMAIL',
    client_type: 'WEB',
    user_agent: 'Mozilla',
    ip_address: '127.0.0.1',
    language: 'en',
    device_id: 'dev_1',
    device_name: 'Chrome',
    app_version: '1.0.0',
    os_version: 'macOS'
  } as any

  const dummySessionDomain = {
    id: 'sess_1'
  } as any

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
    vi.mocked(mockApi.getSessions).mockResolvedValueOnce(appResultFailure({} as any))
    const result = await repository.getSessions(1, 10)
    expect(mockUserStorage.getUserSessionsList).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getSession and caches model on success', async () => {
    const result = await repository.getSession('sess_1' as UserSessionId)
    expect(mockApi.getSession).toHaveBeenCalledWith('sess_1')
    expect(mockUserStorage.addUserSession).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('falls back to cache in getSession on network error', async () => {
    vi.mocked(mockApi.getSession).mockResolvedValueOnce(appResultFailure({} as any))
    const result = await repository.getSession('sess_1' as UserSessionId)
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
    const result = await repository.deleteSession('sess_1' as UserSessionId)
    expect(mockApi.deleteSession).toHaveBeenCalledWith('sess_1')
    expect(mockUserStorage.removeUserSession).toHaveBeenCalledWith('sess_1')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteAllOtherSessions and removes deleted sessions from cache', async () => {
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValueOnce({
      items: [{ id: 'sess_2' }] as any,
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
    const result = await repository.reauthenticateSession('mfa_1', '123456')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith({
      mfa_token: 'mfa_1',
      totp_code: '123456'
    })
    expect(isSuccess(result)).toBe(true)
  })
})
