import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementUserRepositoryImpl } from '@/repository/user/management-user-repository-impl'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementUserRepositoryImpl', () => {
  let mockApi: ManagementUserApi
  let repository: ManagementUserRepositoryImpl

  const dummyUserPayload = {
    id: 'usr_1',
    email: 'user@example.com',
    role: 'SUPER_ADMIN',
    account_status: 'ACTIVE',
    created_at: 1000,
    updated_at: 1000
  } as any

  beforeEach(() => {
    vi.clearAllMocks()

    mockApi = {
      createUser: vi.fn().mockResolvedValue(appResultSuccess(dummyUserPayload)),
      getUsers: vi.fn().mockResolvedValue(appResultSuccess({
        items: [dummyUserPayload],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      })),
      getUser: vi.fn().mockResolvedValue(appResultSuccess(dummyUserPayload)),
      updateUser: vi.fn().mockResolvedValue(appResultSuccess(undefined)),
      deleteUser: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as ManagementUserApi

    repository = new ManagementUserRepositoryImpl(mockApi)
  })

  it('delegates createUser to API and maps result', async () => {
    const result = await repository.createUser({ email: 'user@example.com' } as any)
    expect(mockApi.createUser).toHaveBeenCalledWith({ email: 'user@example.com' })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getUsers to API and maps paged result', async () => {
    const result = await repository.getUsers(1, 10)
    expect(mockApi.getUsers).toHaveBeenCalledWith(
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
      undefined
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates getUser to API and maps result', async () => {
    const result = await repository.getUser('usr_1' as UserId)
    expect(mockApi.getUser).toHaveBeenCalledWith('usr_1')
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates updateUser to API', async () => {
    const result = await repository.updateUser('usr_1' as UserId, { email: 'new@example.com' } as any)
    expect(mockApi.updateUser).toHaveBeenCalledWith('usr_1', { email: 'new@example.com' })
    expect(isSuccess(result)).toBe(true)
  })

  it('delegates deleteUser to API', async () => {
    const result = await repository.deleteUser('usr_1' as UserId)
    expect(mockApi.deleteUser).toHaveBeenCalledWith('usr_1')
    expect(isSuccess(result)).toBe(true)
  })
})
