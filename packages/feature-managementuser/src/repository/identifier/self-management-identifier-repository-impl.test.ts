import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfManagementIdentifierRepositoryImpl } from '@/repository/identifier/self-management-identifier-repository-impl'
import { SelfManagementIdentifiersApiMock } from '@/mock/network/api/identifier/self-management-identifiers-api-mock'
import { SortOrder, TEST_IDENTIFIER_ID, toUserIdentifierIdOrThrow, toUserIdentifierPrivatePayload, createTestUserIdentifierPrivate, createTestPagedResultPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('SelfManagementIdentifierRepositoryImpl', () => {
  let mockApi: SelfManagementIdentifiersApiMock
  let repository: SelfManagementIdentifierRepositoryImpl

  const mockIdentifierPayload = toUserIdentifierPrivatePayload(createTestUserIdentifierPrivate())

  beforeEach(() => {
    mockApi = new SelfManagementIdentifiersApiMock()
    mockApi.getUserIdentifierResult = appResultSuccess(mockIdentifierPayload)
    mockApi.getUserIdentifiersResult = appResultSuccess(createTestPagedResultPayload({
      items: [mockIdentifierPayload],
      total_count: 1,
      page_number: 1,
      page_size: 10,
      total_pages: 1
    }))
    mockApi.emailChangePasswordResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getUserIdentifier').mockImplementation(mockApi.getUserIdentifier.bind(mockApi))
    vi.spyOn(mockApi, 'getUserIdentifiers').mockImplementation(mockApi.getUserIdentifiers.bind(mockApi))
    vi.spyOn(mockApi, 'emailChangePassword').mockImplementation(mockApi.emailChangePassword.bind(mockApi))

    repository = new SelfManagementIdentifierRepositoryImpl(mockApi)
  })

  it('delegates getUserIdentifier and maps payload to domain model', async () => {
    const result = await repository.getUserIdentifier(toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))
    expect(mockApi.getUserIdentifier).toHaveBeenCalledWith(TEST_IDENTIFIER_ID)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getUserIdentifiers and maps paged items', async () => {
    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userAuthProviders: [],
      identifiers: []
    }
    const result = await repository.getUserIdentifiers(params)
    expect(mockApi.getUserIdentifiers).toHaveBeenCalledWith(params)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates emailChangePassword', async () => {
    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const result = await repository.emailChangePassword(identifierId, 'oldPass', 'newPass')
    expect(mockApi.emailChangePassword).toHaveBeenCalledWith(identifierId, {
      old_password: 'oldPass',
      new_password: 'newPass'
    })
    expect(isSuccess(result)).toBe(true)
  })
})
