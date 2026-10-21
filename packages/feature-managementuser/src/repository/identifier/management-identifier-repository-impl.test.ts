import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementIdentifierRepositoryImpl } from '@/repository/identifier/management-identifier-repository-impl'
import { ManagementIdentifierApiMock } from '@/mock/network/api/identifier/management-identifier-api-mock'
import { createTestUserIdentifierPrivatePayload, createTestUserIdentifierSummaryPayload, createTestPagedResult, SortOrder, TEST_IDENTIFIER_ID, TEST_USER_ID, toUserIdentifierIdOrThrow, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementIdentifierRepositoryImpl', () => {
  let mockApi: ManagementIdentifierApiMock
  let repository: ManagementIdentifierRepositoryImpl

  const mockSummaryPayload = createTestUserIdentifierSummaryPayload()
  const mockPrivatePayload = createTestUserIdentifierPrivatePayload()

  beforeEach(() => {
    mockApi = new ManagementIdentifierApiMock()
    mockApi.getIdentifiersResult = appResultSuccess(createTestPagedResult({
      items: [mockSummaryPayload],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    }))
    mockApi.getIdentifierResult = appResultSuccess(mockPrivatePayload)
    mockApi.deleteIdentifierResult = appResultSuccess(undefined)
    mockApi.deleteIdentifierPasswordResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getIdentifiers')
    vi.spyOn(mockApi, 'getIdentifier')
    vi.spyOn(mockApi, 'deleteIdentifier')
    vi.spyOn(mockApi, 'deleteIdentifierPassword')

    repository = new ManagementIdentifierRepositoryImpl(mockApi)
  })

  it('delegates getIdentifiers and maps paged items to domain models', async () => {
    const identifierListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userIds: [],
      userAuthProviders: [],
      identifiers: []
    }
    const identifierListResult = await repository.getIdentifiers(identifierListParams)
    expect(mockApi.getIdentifiers).toHaveBeenCalledWith(identifierListParams)
    expect(isSuccess(identifierListResult)).toBe(true)
  })

  it('delegates getIdentifier and maps response to domain model', async () => {
    const identId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const identifierResult = await repository.getIdentifier(identId)
    expect(mockApi.getIdentifier).toHaveBeenCalledWith(identId)
    expect(isSuccess(identifierResult)).toBe(true)
  })

  it('delegates deleteIdentifier', async () => {
    const identId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const userId = toUserIdOrThrow(TEST_USER_ID)
    const deleteIdentifierResult = await repository.deleteIdentifier(userId, identId)
    expect(mockApi.deleteIdentifier).toHaveBeenCalledWith(userId, identId)
    expect(isSuccess(deleteIdentifierResult)).toBe(true)
  })

  it('delegates deleteIdentifierPassword', async () => {
    const identId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const userId = toUserIdOrThrow(TEST_USER_ID)
    const deletePasswordResult = await repository.deleteIdentifierPassword(userId, identId)
    expect(mockApi.deleteIdentifierPassword).toHaveBeenCalledWith(userId, identId)
    expect(isSuccess(deletePasswordResult)).toBe(true)
  })
})
