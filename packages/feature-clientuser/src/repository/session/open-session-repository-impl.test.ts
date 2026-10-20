import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SortOrder, TEST_SESSION_ID, TEST_USER_ID_2, toUserSessionIdOrThrow, createTestUserSessionSummary, createTestUserSessionPrivatePayload, createTestUserSessionSummaryPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenSessionRepositoryImpl } from '@/repository/session/open-session-repository-impl'
import { AuthStorageMock, SessionApiMock, UserStorageMock} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('OpenSessionRepositoryImpl', () => {
  let mockApi: SessionApiMock
  let mockUserStorage: UserStorageMock
  let mockAuthStorage: AuthStorageMock
  let repository: OpenSessionRepositoryImpl

  beforeEach(() => {
    mockApi = new SessionApiMock()
    mockApi.getSessionResult = appResultSuccess(createTestUserSessionPrivatePayload())
    mockApi.getSessionsResult = appResultSuccess({ items: [createTestUserSessionSummaryPayload()], totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 1 })
    mockApi.deleteAllOtherSessionsResult = appResultSuccess({ deletedSessionIds: [toUserSessionIdOrThrow(TEST_USER_ID_2)] })

    mockUserStorage = new UserStorageMock()
    mockAuthStorage = new AuthStorageMock()

    vi.spyOn(mockApi, 'getSessions').mockImplementation(mockApi.getSessions.bind(mockApi))
    vi.spyOn(mockApi, 'getSession').mockImplementation(mockApi.getSession.bind(mockApi))
    vi.spyOn(mockApi, 'logout').mockImplementation(mockApi.logout.bind(mockApi))
    vi.spyOn(mockApi, 'deleteSession').mockImplementation(mockApi.deleteSession.bind(mockApi))
    vi.spyOn(mockApi, 'deleteAllOtherSessions').mockImplementation(mockApi.deleteAllOtherSessions.bind(mockApi))
    vi.spyOn(mockApi, 'reauthenticateSession').mockImplementation(mockApi.reauthenticateSession.bind(mockApi))

    vi.spyOn(mockUserStorage, 'getUserSessionsList').mockImplementation(mockUserStorage.getUserSessionsList.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'updateUserSessionsPayloadList').mockImplementation(mockUserStorage.updateUserSessionsPayloadList.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'removeUserSession').mockImplementation(mockUserStorage.removeUserSession.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'removeUserSessions').mockImplementation(mockUserStorage.removeUserSessions.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'clear').mockImplementation(mockUserStorage.clear.bind(mockUserStorage))

    vi.spyOn(mockAuthStorage, 'clearTokens').mockImplementation(mockAuthStorage.clearTokens.bind(mockAuthStorage))

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
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValue({ items: [createTestUserSessionSummary()], totalCount: 1, pageNumber: 1, pageSize: 10, totalPages: 1 })

    const sessionsResult = await repository.getSessions(params)
    expect(isSuccess(sessionsResult)).toBe(true)
  })

  it('delegates getSession and maps to domain model on success', async () => {
    const id = toUserSessionIdOrThrow(TEST_SESSION_ID)
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
    const id = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const deleteResult = await repository.deleteSession(id)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(id)
    expect(mockUserStorage.removeUserSession).toHaveBeenCalledWith(id)
    expect(isSuccess(deleteResult)).toBe(true)
  })

  it('delegates deleteAllOtherSessions and cleans up storage', async () => {
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValue({
      items: [createTestUserSessionSummary({ id: toUserSessionIdOrThrow(TEST_USER_ID_2) })],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    })

    const deleteResult = await repository.deleteAllOtherSessions()
    expect(mockApi.deleteAllOtherSessions).toHaveBeenCalled()
    expect(mockUserStorage.removeUserSessions).toHaveBeenCalledWith([toUserSessionIdOrThrow(TEST_USER_ID_2)])
    expect(isSuccess(deleteResult)).toBe(true)
  })

  it('delegates reauthenticateSession', async () => {
    const reauthResult = await repository.reauthenticateSession('mfa123', '654321')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith('mfa123', '654321')
    expect(isSuccess(reauthResult)).toBe(true)
  })
})
