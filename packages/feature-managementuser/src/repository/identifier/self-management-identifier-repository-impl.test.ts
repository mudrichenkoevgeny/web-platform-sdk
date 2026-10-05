import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfManagementIdentifierRepositoryImpl } from '@/repository/identifier/SelfManagementIdentifierRepositoryImpl'
import type { SelfManagementIdentifiersApi } from '@/network/api/identifier/SelfManagementIdentifiersApi'
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'

describe('SelfManagementIdentifierRepositoryImpl', () => {
  let mockApi: SelfManagementIdentifiersApi
  let repository: SelfManagementIdentifierRepositoryImpl

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
    vi.clearAllMocks()

    mockApi = {
      getUserIdentifier: vi.fn().mockResolvedValue(appResultSuccess(dummyIdentifierPayload)),
      getUserIdentifiers: vi.fn().mockResolvedValue(appResultSuccess({
        items: [dummyIdentifierPayload],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      })),
      emailChangePassword: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as SelfManagementIdentifiersApi

    repository = new SelfManagementIdentifierRepositoryImpl(mockApi)
  })

  it('delegates getUserIdentifier and maps payload to domain model', async () => {
    const result = await repository.getUserIdentifier('id_1' as UserIdentifierId)
    expect(mockApi.getUserIdentifier).toHaveBeenCalledWith('id_1')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getUserIdentifiers and maps paged items', async () => {
    const result = await repository.getUserIdentifiers(1, 10)
    expect(mockApi.getUserIdentifiers).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, undefined)
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates emailChangePassword', async () => {
    const result = await repository.emailChangePassword('test@example.com', 'oldPass', 'newPass')
    expect(mockApi.emailChangePassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      old_password: 'oldPass',
      new_password: 'newPass'
    })
    expect(isSuccess(result)).toBe(true)
  })
})
