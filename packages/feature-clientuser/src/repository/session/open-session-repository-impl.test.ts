import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SortOrder, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { OpenSessionRepositoryImpl } from '@/repository/session/open-session-repository-impl'
import { AuthStorageMock, SessionApiMock, UserStorageMock, userSessionPayloadMock, userSessionSummaryMock, userSessionSummaryPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenSessionRepositoryImpl', () => {
  let mockApi: SessionApiMock
  let mockUserStorage: UserStorageMock
  let mockAuthStorage: AuthStorageMock
  let repository: OpenSessionRepositoryImpl

  beforeEach(() => {
    mockApi = new SessionApiMock()
    mockApi.getSessionResult = appResultSuccess(userSessionPayloadMock())
    mockApi.getSessionsResult = appResultSuccess({ items: [userSessionSummaryPayloadMock()], totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 1 })
    mockApi.deleteAllOtherSessionsResult = appResultSuccess({ deletedSessionIds: [toUserSessionIdOrThrow('sess_2')] })

    mockUserStorage = new UserStorageMock()
    mockAuthStorage = new AuthStorageMock()

    vi.spyOn(mockApi, 'getSessions')
    vi.spyOn(mockApi, 'getSession')
    vi.spyOn(mockApi, 'logout')
    vi.spyOn(mockApi, 'deleteSession')
    vi.spyOn(mockApi, 'deleteAllOtherSessions')
    vi.spyOn(mockApi, 'reauthenticateSession')

    vi.spyOn(mockUserStorage, 'getUserSessionsList')
    vi.spyOn(mockUserStorage, 'updateUserSessionsPayloadList')
    vi.spyOn(mockUserStorage, 'removeUserSession')
    vi.spyOn(mockUserStorage, 'removeUserSessions')
    vi.spyOn(mockUserStorage, 'clear')

    vi.spyOn(mockAuthStorage, 'clearTokens')

    repository = new OpenSessionRepositoryImpl(mockApi, mockUserStorage, mockAuthStorage)
  })

  it('delegates getSessions and updates storage on success', async () => {
    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      identifiers: [],
      identifierIds: [],
      userAuthProviders: [],
      clientTypes: [],
      userAgents: [],
      ipAddresses: [],
      languages: [],
      deviceIds: [],
      deviceNames: [],
      appVersions: [],
      osVersions: []
    }
    const sessionsResult = await repository.getSessions(params)
    expect(mockApi.getSessions).toHaveBeenCalled()
    expect(mockUserStorage.updateUserSessionsPayloadList).toHaveBeenCalled()
    expect(isSuccess(sessionsResult)).toBe(true)
  })

  it('falls back to cached sessions when network fails', async () => {
    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      identifiers: [],
      identifierIds: [],
      userAuthProviders: [],
      clientTypes: [],
      userAgents: [],
      ipAddresses: [],
      languages: [],
      deviceIds: [],
      deviceNames: [],
      appVersions: [],
      osVersions: []
    }
    mockApi.getSessionsResult = appResultFailure(CommonError.unknown())
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValue({ items: [userSessionSummaryMock()], totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 1 })

    const sessionsResult = await repository.getSessions(params)
    expect(isSuccess(sessionsResult)).toBe(true)
  })

  it('delegates getSession and maps to domain model on success', async () => {
    const id = toUserSessionIdOrThrow('sess_1')
    const sessionResult = await repository.getSession(id)
    expect(mockApi.getSession).toHaveBeenCalledWith(id)
    expect(isSuccess(sessionResult)).toBe(true)
  })

  it('delegates logout and clears storages', async () => {
    const logoutResult = await repository.logout()
    expect(mockApi.logout).toHaveBeenCalled()
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
    expect(isSuccess(logoutResult)).toBe(true)
  })

  it('delegates deleteSession and removes from storage', async () => {
    const id = toUserSessionIdOrThrow('sess_1')
    const deleteResult = await repository.deleteSession(id)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(id)
    expect(mockUserStorage.removeUserSession).toHaveBeenCalledWith(id)
    expect(isSuccess(deleteResult)).toBe(true)
  })

  it('delegates deleteAllOtherSessions and cleans up storage', async () => {
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValue({
      items: [userSessionSummaryMock({ id: toUserSessionIdOrThrow('sess_2') })],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    })

    const deleteResult = await repository.deleteAllOtherSessions()
    expect(mockApi.deleteAllOtherSessions).toHaveBeenCalled()
    expect(mockUserStorage.removeUserSessions).toHaveBeenCalledWith([toUserSessionIdOrThrow('sess_2')])
    expect(isSuccess(deleteResult)).toBe(true)
  })

  it('delegates reauthenticateSession', async () => {
    const reauthResult = await repository.reauthenticateSession('mfa123', '654321')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith('mfa123', '654321')
    expect(isSuccess(reauthResult)).toBe(true)
  })
})
