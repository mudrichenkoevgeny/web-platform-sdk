import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfManagementIdentifierRepositoryImpl } from '@/repository/identifier/self-management-identifier-repository-impl'
import { SelfManagementIdentifiersApiMock } from '@/mock/network/api/identifier/self-management-identifiers-api-mock'
import { SortOrder, TEST_IDENTIFIER_ID, toUserIdentifierIdOrThrow, toUserIdentifierPrivatePayload, createTestUserIdentifierPrivate, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'

describe('SelfManagementIdentifierRepositoryImpl', () => {
  let mockApi: SelfManagementIdentifiersApiMock
  let repository: SelfManagementIdentifierRepositoryImpl

  const mockIdentifierPayload = toUserIdentifierPrivatePayload(createTestUserIdentifierPrivate())

  beforeEach(() => {
    mockApi = new SelfManagementIdentifiersApiMock()
    mockApi.getUserIdentifierResult = appResultSuccess(mockIdentifierPayload)
    mockApi.getUserIdentifiersResult = appResultSuccess(createTestPagedResult({
      items: [mockIdentifierPayload],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1
    }))
    mockApi.emailChangePasswordResult = appResultSuccess(undefined)

    vi.spyOn(mockApi, 'getUserIdentifier')
    vi.spyOn(mockApi, 'getUserIdentifiers')
    vi.spyOn(mockApi, 'emailChangePassword')

    repository = new SelfManagementIdentifierRepositoryImpl(mockApi)
  })

  it('delegates getUserIdentifier and maps payload to domain model', async () => {
    const identifierResult = await repository.getUserIdentifier(toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))
    expect(mockApi.getUserIdentifier).toHaveBeenCalledWith(TEST_IDENTIFIER_ID)
    expect(isSuccess(identifierResult)).toBe(true)
  })

  it('delegates getUserIdentifiers and maps paged items', async () => {
    const selfIdentifierListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userAuthProviders: [],
      identifiers: []
    }
    const identifierListResult = await repository.getUserIdentifiers(selfIdentifierListParams)
    expect(mockApi.getUserIdentifiers).toHaveBeenCalledWith(selfIdentifierListParams)
    expect(isSuccess(identifierListResult)).toBe(true)
  })

  it('delegates emailChangePassword', async () => {
    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const changePasswordResult = await repository.emailChangePassword(identifierId, 'oldPass', 'newPass')
    expect(mockApi.emailChangePassword).toHaveBeenCalledWith(identifierId, {
      old_password: 'oldPass',
      new_password: 'newPass'
    })
    expect(isSuccess(changePasswordResult)).toBe(true)
  })
})
