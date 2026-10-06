import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionPayload } from '@mudrichenkoevgeny/shared-foundation'
import {
  ClientType,
  UserAuthProvider,
  toUserIdentifierIdOrThrow,
  toUserIdOrThrow,
  toUserSessionIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { ManagementSessionRepositoryImpl } from '@/repository/session/management-session-repository-impl'
import type { ManagementSessionApi } from '@/network/api/session/management-session-api'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'

describe('ManagementSessionRepositoryImpl', () => {
  let mockApi: ManagementSessionApi
  let repository: ManagementSessionRepositoryImpl

  const dummySessionPayload: UserSessionPayload = {
    id: toUserSessionIdOrThrow('sess_1'),
    user_id: toUserIdOrThrow('usr_1'),
    user_role: 'staff',
    created_at: 1000,
    updated_at: 1000,
    expires_at: 2000,
    last_accessed_at: 1000,
    last_reauthenticated_at: 1000,
    identifier_id: toUserIdentifierIdOrThrow('id_1'),
    identifier: 'user@example.com',
    identifier_display_name: 'user@example.com',
    identifier_auth_provider: UserAuthProvider.EMAIL,
    client_device_info: {
      client_type: ClientType.WEB,
      language: 'en',
      device_id: null,
      device_name: 'Chrome',
      app_version: '1.0.0',
      operation_system_version: 'macOS'
    },
    user_agent: 'Mozilla',
    ip_address: '127.0.0.1',
    is_sensitive_values_masked: false
  }

  beforeEach(() => {
    mockApi = {
      getSessions: vi.fn().mockResolvedValue(appResultSuccess({
        items: [dummySessionPayload],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      })),
      getSession: vi.fn().mockResolvedValue(appResultSuccess(dummySessionPayload)),
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
