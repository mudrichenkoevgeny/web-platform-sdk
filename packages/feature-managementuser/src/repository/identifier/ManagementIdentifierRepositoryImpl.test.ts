import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementIdentifierRepositoryImpl } from '@/repository/identifier/ManagementIdentifierRepositoryImpl'
import type { ManagementIdentifierApi } from '@/network/api/identifier/ManagementIdentifierApi'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'

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
  } as any

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
    const result = await repository.getIdentifier('id_1')
    expect(mockApi.getIdentifier).toHaveBeenCalledWith('id_1')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteIdentifier', async () => {
    const result = await repository.deleteIdentifier('usr_1' as UserId, 'id_1')
    expect(mockApi.deleteIdentifier).toHaveBeenCalledWith('usr_1', 'id_1')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteIdentifierPassword', async () => {
    const result = await repository.deleteIdentifierPassword('usr_1' as UserId, 'id_1')
    expect(mockApi.deleteIdentifierPassword).toHaveBeenCalledWith('usr_1', 'id_1')
    expect(isSuccess(result)).toBe(true)
  })
})
