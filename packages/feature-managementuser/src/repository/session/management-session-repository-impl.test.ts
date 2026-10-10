import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  userSessionPrivatePayloadMock,
  userSessionSummaryPayloadMock
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementSessionRepositoryImpl } from '@/repository/session/management-session-repository-impl'
import type { ManagementSessionApi } from '@/network/api/session/management-session-api'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementSessionRepositoryImpl', () => {
  let mockApi: ManagementSessionApi
  let repository: ManagementSessionRepositoryImpl

  const dummySummaryPayload = userSessionSummaryPayloadMock()
  const dummyPrivatePayload = userSessionPrivatePayloadMock()

  beforeEach(() => {
    mockApi = {
      getSessions: vi.fn().mockResolvedValue(appResultSuccess({
        items: [dummySummaryPayload],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      })),
      getSession: vi.fn().mockResolvedValue(appResultSuccess(dummyPrivatePayload)),
      deleteSession: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      deleteAllUserSessions: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as ManagementSessionApi

    repository = new ManagementSessionRepositoryImpl(mockApi)
  })

  it('delegates getSessions and maps paged items to domain models', async () => {
    const result = await repository.getSessions(1, 10)
    expect(mockApi.getSessions).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getSession and maps response to domain model', async () => {
    const result = await repository.getSession('sess_1')
    expect(mockApi.getSession).toHaveBeenCalledWith('sess_1')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteSession', async () => {
    const result = await repository.deleteSession('usr_1' as UserId, 'sess_1')
    expect(mockApi.deleteSession).toHaveBeenCalledWith('usr_1', 'sess_1')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteAllUserSessions', async () => {
    const result = await repository.deleteAllUserSessions('usr_1' as UserId)
    expect(mockApi.deleteAllUserSessions).toHaveBeenCalledWith('usr_1')
    expect(isSuccess(result)).toBe(true)
  })
})
