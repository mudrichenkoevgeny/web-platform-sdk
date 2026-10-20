import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, isSuccess, toErrorIdOrThrow } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SortOrder, TEST_SESSION_ID, TEST_USER_ID_2, toUserSessionIdOrThrow, createTestUserSessionPrivatePayload, createTestUserSessionSummaryPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementSessionRepositoryImpl } from '@/repository/session/self-management-session-repository-impl'
import { SelfManagementSessionApiMock } from '@/mock/network/api/session/self-management-session-api-mock'
import { AuthStorageMock, UserStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('SelfManagementSessionRepositoryImpl', () => {
  let mockApi: SelfManagementSessionApiMock
  let mockUserStorage: UserStorageMock
  let mockAuthStorage: AuthStorageMock
  let repository: SelfManagementSessionRepositoryImpl

  const mockSummaryPayload = createTestUserSessionSummaryPayload()
  const mockPrivatePayload = createTestUserSessionPrivatePayload()
  const mockSessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
  const mockSessionId2 = toUserSessionIdOrThrow(TEST_USER_ID_2)

  const mockError: AppError = {
    id: toErrorIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
    code: 'NETWORK_ERROR',
    isRetryable: true
  }

  beforeEach(() => {
    mockApi = new SelfManagementSessionApiMock()
    mockApi.getSessionsResult = appResultSuccess(createTestPagedResult({
      items: [mockSummaryPayload],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    }))
    mockApi.getSessionResult = appResultSuccess(mockPrivatePayload)
    mockApi.logoutResult = appResultSuccess(undefined)
    mockApi.deleteSessionResult = appResultSuccess(undefined)
    mockApi.deleteAllOtherSessionsResult = appResultSuccess({
      deletedSessionIds: [toUserSessionIdOrThrow(TEST_USER_ID_2)]
    })
    mockApi.reauthenticateSessionResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getSessions').mockImplementation(mockApi.getSessions.bind(mockApi))
    vi.spyOn(mockApi, 'getSession').mockImplementation(mockApi.getSession.bind(mockApi))
    vi.spyOn(mockApi, 'logout').mockImplementation(mockApi.logout.bind(mockApi))
    vi.spyOn(mockApi, 'deleteSession').mockImplementation(mockApi.deleteSession.bind(mockApi))
    vi.spyOn(mockApi, 'deleteAllOtherSessions').mockImplementation(mockApi.deleteAllOtherSessions.bind(mockApi))
    vi.spyOn(mockApi, 'reauthenticateSession').mockImplementation(mockApi.reauthenticateSession.bind(mockApi))

    mockUserStorage = new UserStorageMock()
    mockUserStorage.updateUserSessionsPayloadList(createTestPagedResult({ items: [mockSummaryPayload] }))
    vi.spyOn(mockUserStorage, 'getUserSessionsList').mockImplementation(mockUserStorage.getUserSessionsList.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'updateUserSessionsPayloadList').mockImplementation(mockUserStorage.updateUserSessionsPayloadList.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'removeUserSession').mockImplementation(mockUserStorage.removeUserSession.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'removeUserSessions').mockImplementation(mockUserStorage.removeUserSessions.bind(mockUserStorage))
    vi.spyOn(mockUserStorage, 'clear').mockImplementation(mockUserStorage.clear.bind(mockUserStorage))

    mockAuthStorage = new AuthStorageMock()
    vi.spyOn(mockAuthStorage, 'clearTokens').mockImplementation(mockAuthStorage.clearTokens.bind(mockAuthStorage))

    repository = new SelfManagementSessionRepositoryImpl(mockApi, mockUserStorage, mockAuthStorage)
  })

  it('delegates getSessions and caches payload on network success', async () => {
    const managementSessionListParams = {
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
    const sessionsResult = await repository.getSessions(managementSessionListParams)
    expect(mockApi.getSessions).toHaveBeenCalled()
    expect(mockUserStorage.updateUserSessionsPayloadList).toHaveBeenCalled()
    expect(isSuccess(sessionsResult)).toBe(true)
  })

  it('falls back to cache in getSessions on network error', async () => {
    const managementSessionListParams = {
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
    mockApi.getSessionsResult = appResultFailure(mockError)
    const sessionsResult = await repository.getSessions(managementSessionListParams)
    expect(mockUserStorage.getUserSessionsList).toHaveBeenCalled()
    expect(isSuccess(sessionsResult)).toBe(true)
  })

  it('delegates getSession', async () => {
    const sessionResult = await repository.getSession(mockSessionId)
    expect(mockApi.getSession).toHaveBeenCalledWith(mockSessionId)
    expect(isSuccess(sessionResult)).toBe(true)
  })

  it('delegates logout and clears storage', async () => {
    const logoutResult = await repository.logout()
    expect(mockApi.logout).toHaveBeenCalled()
    expect(mockUserStorage.clear).toHaveBeenCalled()
    expect(mockAuthStorage.clearTokens).toHaveBeenCalled()
    expect(isSuccess(logoutResult)).toBe(true)
  })

  it('delegates deleteSession and removes from cache', async () => {
    const deleteResult = await repository.deleteSession(mockSessionId)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(mockSessionId)
    expect(mockUserStorage.removeUserSession).toHaveBeenCalledWith(mockSessionId)
    expect(isSuccess(deleteResult)).toBe(true)
  })

  it('delegates deleteAllOtherSessions and removes deleted sessions from cache', async () => {
    mockUserStorage.updateUserSessionsPayloadList(
      createTestPagedResult({
        items: [createTestUserSessionSummaryPayload({ id: toUserSessionIdOrThrow(TEST_USER_ID_2) })]
      })
    )

    const deleteAllOtherResult = await repository.deleteAllOtherSessions()
    expect(mockApi.deleteAllOtherSessions).toHaveBeenCalled()
    expect(mockUserStorage.removeUserSessions).toHaveBeenCalledWith([mockSessionId2])
    expect(isSuccess(deleteAllOtherResult)).toBe(true)
  })

  it('delegates reauthenticateSession', async () => {
    const reauthenticateResult = await repository.reauthenticateSession('mfa_1', '123456')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith('mfa_1', '123456')
    expect(isSuccess(reauthenticateResult)).toBe(true)
  })
})
