import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, isSuccess, toErrorIdOrThrow } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SortOrder, TEST_SESSION_ID, TEST_USER_ID_2, toUserSessionSummary, toUserSessionIdOrThrow, createTestUserSessionPrivatePayload, createTestUserSessionSummaryPayload, createTestPagedResultPayload } from '@mudrichenkoevgeny/shared-foundation'
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
  const mockSummaryDomain = toUserSessionSummary(mockSummaryPayload)
  const mockSessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
  const mockSessionId2 = toUserSessionIdOrThrow(TEST_USER_ID_2)

  const mockError: AppError = {
    id: toErrorIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
    code: 'NETWORK_ERROR',
    isRetryable: true
  }

  beforeEach(() => {
    mockApi = new SelfManagementSessionApiMock()
    mockApi.getSessionsResult = appResultSuccess(createTestPagedResultPayload({
      items: [mockSummaryPayload],
      total_count: 1,
      page_number: 1,
      page_size: 10,
      total_pages: 1
    }))
    mockApi.getSessionResult = appResultSuccess(mockPrivatePayload)
    mockApi.logoutResult = appResultSuccess(undefined)
    mockApi.deleteSessionResult = appResultSuccess(undefined)
    mockApi.deleteAllOtherSessionsResult = appResultSuccess({
      deleted_session_ids: [TEST_USER_ID_2]
    })
    mockApi.reauthenticateSessionResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getSessions').mockImplementation(mockApi.getSessions.bind(mockApi))
    vi.spyOn(mockApi, 'getSession').mockImplementation(mockApi.getSession.bind(mockApi))
    vi.spyOn(mockApi, 'logout').mockImplementation(mockApi.logout.bind(mockApi))
    vi.spyOn(mockApi, 'deleteSession').mockImplementation(mockApi.deleteSession.bind(mockApi))
    vi.spyOn(mockApi, 'deleteAllOtherSessions').mockImplementation(mockApi.deleteAllOtherSessions.bind(mockApi))
    vi.spyOn(mockApi, 'reauthenticateSession').mockImplementation(mockApi.reauthenticateSession.bind(mockApi))

    mockUserStorage = new UserStorageMock()
    mockUserStorage.updateUserSessionsPayloadList([mockSummaryPayload])
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
    const result = await repository.getSessions(params)
    expect(mockApi.getSessions).toHaveBeenCalled()
    expect(mockUserStorage.updateUserSessionsPayloadList).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('falls back to cache in getSessions on network error', async () => {
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
    mockApi.getSessionsResult = appResultFailure(mockError)
    const result = await repository.getSessions(params)
    expect(mockUserStorage.getUserSessionsList).toHaveBeenCalled()
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getSession', async () => {
    const result = await repository.getSession(mockSessionId)
    expect(mockApi.getSession).toHaveBeenCalledWith(mockSessionId)
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
    const result = await repository.deleteSession(mockSessionId)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(mockSessionId)
    expect(mockUserStorage.removeUserSession).toHaveBeenCalledWith(mockSessionId)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteAllOtherSessions and removes deleted sessions from cache', async () => {
    mockUserStorage.updateUserSessionsPayloadList([
      createTestUserSessionSummaryPayload({ id: toUserSessionIdOrThrow(TEST_USER_ID_2) })
    ])

    const result = await repository.deleteAllOtherSessions()
    expect(mockApi.deleteAllOtherSessions).toHaveBeenCalled()
    expect(mockUserStorage.removeUserSessions).toHaveBeenCalledWith([mockSessionId2])
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates reauthenticateSession', async () => {
    const result = await repository.reauthenticateSession('mfa_1', '123456')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith('mfa_1', '123456')
    expect(isSuccess(result)).toBe(true)
  })
})
