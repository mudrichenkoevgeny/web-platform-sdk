import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementIdentifierRepositoryImpl } from '@/repository/identifier/management-identifier-repository-impl'
import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'
import { userIdentifierPrivatePayloadMock, userIdentifierSummaryPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { toUserIdentifierIdOrThrow, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementIdentifierRepositoryImpl', () => {
  let mockApi: ManagementIdentifierApi
  let repository: ManagementIdentifierRepositoryImpl

  const dummySummaryPayload = userIdentifierSummaryPayloadMock()
  const dummyPrivatePayload = userIdentifierPrivatePayloadMock()

  beforeEach(() => {
    mockApi = {
      getIdentifiers: vi.fn().mockResolvedValue(appResultSuccess({
        items: [dummySummaryPayload],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      })),
      getIdentifier: vi.fn().mockResolvedValue(appResultSuccess(dummyPrivatePayload)),
      deleteIdentifier: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      deleteIdentifierPassword: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as ManagementIdentifierApi

    repository = new ManagementIdentifierRepositoryImpl(mockApi)
  })

  it('delegates getIdentifiers and maps paged items to domain models', async () => {
    const result = await repository.getIdentifiers(1, 10)
    expect(mockApi.getIdentifiers).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, undefined, undefined)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getIdentifier and maps response to domain model', async () => {
    const identId = toUserIdentifierIdOrThrow('223e4567-e89b-12d3-a456-426614174001')
    const result = await repository.getIdentifier(identId)
    expect(mockApi.getIdentifier).toHaveBeenCalledWith(identId)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteIdentifier', async () => {
    const identId = toUserIdentifierIdOrThrow('223e4567-e89b-12d3-a456-426614174001')
    const userId = toUserIdOrThrow('usr_1')
    const result = await repository.deleteIdentifier(userId, identId)
    expect(mockApi.deleteIdentifier).toHaveBeenCalledWith(userId, identId)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteIdentifierPassword', async () => {
    const identId = toUserIdentifierIdOrThrow('223e4567-e89b-12d3-a456-426614174001')
    const userId = toUserIdOrThrow('usr_1')
    const result = await repository.deleteIdentifierPassword(userId, identId)
    expect(mockApi.deleteIdentifierPassword).toHaveBeenCalledWith(userId, identId)
    expect(isSuccess(result)).toBe(true)
  })
})
