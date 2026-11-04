import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, isSuccess, toErrorIdOrThrow } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SortOrder, TEST_SESSION_ID, toUserSessionIdOrThrow, createTestUserSessionPrivatePayload, createTestUserSessionSummaryPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
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
      deletedSessionIds: [toUserSessionIdOrThrow('sess_456')]
    })
    mockApi.reauthenticateSessionResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getSessions')
    vi.spyOn(mockApi, 'getSession')
    vi.spyOn(mockApi, 'logout')
    vi.spyOn(mockApi, 'deleteSession')
    vi.spyOn(mockApi, 'deleteAllOtherSessions')
    vi.spyOn(mockApi, 'reauthenticateSession')

    mockUserStorage = new UserStorageMock()
    vi.spyOn(mockUserStorage, 'clear')

    mockAuthStorage = new AuthStorageMock()
    vi.spyOn(mockAuthStorage, 'clearTokens')

    repository = new SelfManagementSessionRepositoryImpl(mockApi, mockUserStorage, mockAuthStorage)
  })

  it('delegates getSessions and maps items on success', async () => {
    const managementSessionListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC
    }
    const sessionsResult = await repository.getSessions(managementSessionListParams)
    expect(mockApi.getSessions).toHaveBeenCalled()
    expect(isSuccess(sessionsResult)).toBe(true)
  })

  it('returns failure when network fails in getSessions', async () => {
    mockApi.getSessionsResult = appResultFailure(mockError)
    const sessionsResult = await repository.getSessions()
    expect(isSuccess(sessionsResult)).toBe(false)
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

  it('delegates deleteSession', async () => {
    const deleteResult = await repository.deleteSession(mockSessionId)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(mockSessionId)
    expect(isSuccess(deleteResult)).toBe(true)
  })

  it('delegates deleteAllOtherSessions', async () => {
    const deleteAllOtherResult = await repository.deleteAllOtherSessions()
    expect(mockApi.deleteAllOtherSessions).toHaveBeenCalled()
    expect(isSuccess(deleteAllOtherResult)).toBe(true)
  })

  it('delegates reauthenticateSession', async () => {
    const reauthenticateResult = await repository.reauthenticateSession('mfa_1', '123456')
    expect(mockApi.reauthenticateSession).toHaveBeenCalledWith('mfa_1', '123456')
    expect(isSuccess(reauthenticateResult)).toBe(true)
  })
})
