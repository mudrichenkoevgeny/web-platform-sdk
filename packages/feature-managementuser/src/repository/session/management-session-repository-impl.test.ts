import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserSessionPrivatePayload, createTestUserSessionSummaryPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementSessionRepositoryImpl } from '@/repository/session/management-session-repository-impl'
import { ManagementSessionApiMock } from '@/mock/network/api/session/management-session-api-mock'
import { SortOrder, TEST_SESSION_ID, TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementSessionRepositoryImpl', () => {
  let mockApi: ManagementSessionApiMock
  let repository: ManagementSessionRepositoryImpl

  const mockSummaryPayload = createTestUserSessionSummaryPayload()
  const mockPrivatePayload = createTestUserSessionPrivatePayload()

  beforeEach(() => {
    mockApi = new ManagementSessionApiMock()
    mockApi.getSessionsResult = appResultSuccess(createTestPagedResult({
      items: [mockSummaryPayload],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    }))
    mockApi.getSessionResult = appResultSuccess(mockPrivatePayload)
    mockApi.deleteSessionResult = appResultSuccess(undefined)
    mockApi.deleteAllUserSessionsResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getSessions').mockImplementation(mockApi.getSessions.bind(mockApi))
    vi.spyOn(mockApi, 'getSession').mockImplementation(mockApi.getSession.bind(mockApi))
    vi.spyOn(mockApi, 'deleteSession').mockImplementation(mockApi.deleteSession.bind(mockApi))
    vi.spyOn(mockApi, 'deleteAllUserSessions').mockImplementation(mockApi.deleteAllUserSessions.bind(mockApi))

    repository = new ManagementSessionRepositoryImpl(mockApi)
  })

  it('delegates getSessions and maps paged items to domain models', async () => {
    const managementSessionListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userIds: [],
      userRoles: [],
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
    const sessionListResult = await repository.getSessions(managementSessionListParams)
    expect(mockApi.getSessions).toHaveBeenCalledWith(managementSessionListParams)
    expect(isSuccess(sessionListResult)).toBe(true)
  })

  it('delegates getSession and maps response to domain model', async () => {
    const sessionResult = await repository.getSession(TEST_SESSION_ID)
    expect(mockApi.getSession).toHaveBeenCalledWith(TEST_SESSION_ID)
    expect(isSuccess(sessionResult)).toBe(true)
  })

  it('delegates deleteSession', async () => {
    const deleteSessionResult = await repository.deleteSession(toUserIdOrThrow(TEST_USER_ID), TEST_SESSION_ID)
    expect(mockApi.deleteSession).toHaveBeenCalledWith(TEST_USER_ID, TEST_SESSION_ID)
    expect(isSuccess(deleteSessionResult)).toBe(true)
  })

  it('delegates deleteAllUserSessions', async () => {
    const deleteAllSessionsResult = await repository.deleteAllUserSessions(toUserIdOrThrow(TEST_USER_ID))
    expect(mockApi.deleteAllUserSessions).toHaveBeenCalledWith(TEST_USER_ID)
    expect(isSuccess(deleteAllSessionsResult)).toBe(true)
  })
})
