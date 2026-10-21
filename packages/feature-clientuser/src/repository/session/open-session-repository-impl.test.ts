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
    const selfSessionListParams = {
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
    const sessionListResult = await repository.getSessions(selfSessionListParams)
    expect(mockApi.getSessions).toHaveBeenCalled()
    expect(mockUserStorage.updateUserSessionsPayloadList).toHaveBeenCalled()
    expect(isSuccess(sessionListResult)).toBe(true)
  })

  it('falls back to cached sessions when network fails', async () => {
    const selfSessionListParams = {
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

    const sessionListResult = await repository.getSessions(selfSessionListParams)
    expect(isSuccess(sessionListResult)).toBe(true)
  })

  it('delegates getSession and maps to domain model on success', async () => {
    const sessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const sessionResult = await repository.getSession(sessionId)
    expect(mockApi.getSession).toHaveBeenCalledWith(sessionId)
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
    const sessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const deleteSessionResult = await repository.deleteSession(sessionId)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(sessionId)
    expect(mockUserStorage.removeUserSession).toHaveBeenCalledWith(sessionId)
    expect(isSuccess(deleteSessionResult)).toBe(true)
  })

  it('delegates deleteAllOtherSessions and cleans up storage', async () => {
    vi.mocked(mockUserStorage.getUserSessionsList).mockResolvedValue({
      items: [createTestUserSessionSummary({ id: toUserSessionIdOrThrow(TEST_USER_ID_2) })],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    })

    const deleteAllOtherSessionsResult = await repository.deleteAllOtherSessions()
    expect(mockApi.deleteAllOtherSessions).toHaveBeenCalled()
    expect(mockUserStorage.removeUserSessions).toHaveBeenCalledWith([toUserSessionIdOrThrow(TEST_USER_ID_2)])
    expect(isSuccess(deleteAllOtherSessionsResult)).toBe(true)
  })

  it('delegates reauthenticateSession', async () => {
    const reauthenticateResult = await repository.reauthenticateSession('mfa123', '654321')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith('mfa123', '654321')
    expect(isSuccess(reauthenticateResult)).toBe(true)
  })
})
