import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementIdentifierRepositoryImpl } from '@/repository/identifier/management-identifier-repository-impl'
import { ManagementIdentifierApiMock } from '@/mock/network/api/identifier/management-identifier-api-mock'
import { createTestUserIdentifierPrivatePayload, createTestUserIdentifierSummaryPayload, createTestPagedResultPayload, SortOrder, TEST_IDENTIFIER_ID, TEST_USER_ID, toUserIdentifierIdOrThrow, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementIdentifierRepositoryImpl', () => {
  let mockApi: ManagementIdentifierApiMock
  let repository: ManagementIdentifierRepositoryImpl

  const mockSummaryPayload = createTestUserIdentifierSummaryPayload()
  const mockPrivatePayload = createTestUserIdentifierPrivatePayload()

  beforeEach(() => {
    mockApi = new ManagementIdentifierApiMock()
    mockApi.getIdentifiersResult = appResultSuccess(createTestPagedResultPayload({
      items: [mockSummaryPayload],
      total_count: 1,
      page_number: 1,
      page_size: 10,
      total_pages: 1
    }))
    mockApi.getIdentifierResult = appResultSuccess(mockPrivatePayload)
    mockApi.deleteIdentifierResult = appResultSuccess(undefined)
    mockApi.deleteIdentifierPasswordResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getIdentifiers').mockImplementation(mockApi.getIdentifiers.bind(mockApi))
    vi.spyOn(mockApi, 'getIdentifier').mockImplementation(mockApi.getIdentifier.bind(mockApi))
    vi.spyOn(mockApi, 'deleteIdentifier').mockImplementation(mockApi.deleteIdentifier.bind(mockApi))
    vi.spyOn(mockApi, 'deleteIdentifierPassword').mockImplementation(mockApi.deleteIdentifierPassword.bind(mockApi))

    repository = new ManagementIdentifierRepositoryImpl(mockApi)
  })

  it('delegates getIdentifiers and maps paged items to domain models', async () => {
    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userIds: [],
      userAuthProviders: [],
      identifiers: []
    }
    const result = await repository.getIdentifiers(params)
    expect(mockApi.getIdentifiers).toHaveBeenCalledWith(params)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getIdentifier and maps response to domain model', async () => {
    const identId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const result = await repository.getIdentifier(identId)
    expect(mockApi.getIdentifier).toHaveBeenCalledWith(identId)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteIdentifier', async () => {
    const identId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await repository.deleteIdentifier(userId, identId)
    expect(mockApi.deleteIdentifier).toHaveBeenCalledWith(userId, identId)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteIdentifierPassword', async () => {
    const identId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await repository.deleteIdentifierPassword(userId, identId)
    expect(mockApi.deleteIdentifierPassword).toHaveBeenCalledWith(userId, identId)
    expect(isSuccess(result)).toBe(true)
  })
})
