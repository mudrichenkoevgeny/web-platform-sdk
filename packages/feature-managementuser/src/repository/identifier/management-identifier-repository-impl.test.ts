import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementIdentifierRepositoryImpl } from '@/repository/identifier/management-identifier-repository-impl'
import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'
import type { UserIdentifierPayload } from '@mudrichenkoevgeny/shared-foundation'
import { toUserIdentifierIdOrThrow, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementIdentifierRepositoryImpl', () => {
  let mockApi: ManagementIdentifierApi
  let repository: ManagementIdentifierRepositoryImpl

  const dummyIdentifierPayload = {
    id: 'id_1',
    user_id: 'usr_1',
    auth_provider: 'EMAIL',
    identifier: 'user@example.com',
    confirmed_at: 1000,
    created_at: 1000,
    updated_at: 1000
  } as unknown as UserIdentifierPayload

  beforeEach(() => {
    mockApi = {
      getIdentifiers: vi.fn().mockResolvedValue(appResultSuccess({
        items: [dummyIdentifierPayload],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      })),
      getIdentifier: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifierPayload)),
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
    const identId = toUserIdentifierIdOrThrow('id_1')
    const result = await repository.getIdentifier(identId)
    expect(mockApi.getIdentifier).toHaveBeenCalledWith(identId)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteIdentifier', async () => {
    const identId = toUserIdentifierIdOrThrow('id_1')
    const userId = toUserIdOrThrow('usr_1')
    const result = await repository.deleteIdentifier(userId, identId)
    expect(mockApi.deleteIdentifier).toHaveBeenCalledWith(userId, identId)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteIdentifierPassword', async () => {
    const identId = toUserIdentifierIdOrThrow('id_1')
    const userId = toUserIdOrThrow('usr_1')
    const result = await repository.deleteIdentifierPassword(userId, identId)
    expect(mockApi.deleteIdentifierPassword).toHaveBeenCalledWith(userId, identId)
    expect(isSuccess(result)).toBe(true)
  })
})
