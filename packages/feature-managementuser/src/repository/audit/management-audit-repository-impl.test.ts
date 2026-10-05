import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementAuditRepositoryImpl } from '@/repository/audit/ManagementAuditRepositoryImpl'
import type { ManagementAuditApi } from '@/network/api/audit/ManagementAuditApi'

describe('ManagementAuditRepositoryImpl', () => {
  let mockApi: ManagementAuditApi
  let repository: ManagementAuditRepositoryImpl
  let dummyActionParser: any
  let dummyResourceParser: any
  let dummyMetadataParser: any

  const dummyAuditEventPayload = {
    id: 'evt_1',
    actor_id: 'usr_1',
    actor_type: 'USER',
    actor_user_role: 'SUPER_ADMIN',
    action: 'CREATE_USER',
    resource: 'USER',
    resource_id: 'usr_2',
    status: 'SUCCESS',
    message: 'User created',
    created_at: 1000,
    metadata: [
      {
        key: 'IP_ADDRESS',
        value: '127.0.0.1'
      }
    ]
  } as any

  beforeEach(() => {
    vi.clearAllMocks()

    dummyActionParser = {
      fromValueOrThrow: vi.fn().mockImplementation((val) => val)
    }
    dummyResourceParser = {
      fromValueOrThrow: vi.fn().mockImplementation((val) => val)
    }
    dummyMetadataParser = {
      fromValueOrThrow: vi.fn().mockImplementation((val) => val)
    }

    mockApi = {
      getAuditEvents: vi.fn().mockResolvedValue(appResultSuccess({
        items: [dummyAuditEventPayload],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1
      })),
      getAuditEvent: vi.fn().mockResolvedValue(appResultSuccess(dummyAuditEventPayload))
    } as unknown as ManagementAuditApi

    repository = new ManagementAuditRepositoryImpl(
      mockApi,
      dummyActionParser,
      dummyResourceParser,
      dummyMetadataParser
    )
  })

  it('delegates getAuditEvents and maps paged items to domain events', async () => {
    const result = await repository.getAuditEvents(1, 10)
    expect(mockApi.getAuditEvents).toHaveBeenCalledWith(
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
    expect(dummyActionParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(dummyActionParser.fromValueOrThrow).toHaveBeenCalledWith('CREATE_USER')
    expect(dummyResourceParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(dummyResourceParser.fromValueOrThrow).toHaveBeenCalledWith('USER')
    expect(dummyMetadataParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(dummyMetadataParser.fromValueOrThrow).toHaveBeenCalledWith('IP_ADDRESS')
  })

  it('delegates getAuditEvent and maps response to domain event', async () => {
    const result = await repository.getAuditEvent('evt_1')
    expect(mockApi.getAuditEvent).toHaveBeenCalledWith('evt_1')
    expect(isSuccess(result)).toBe(true)
    expect(dummyActionParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(dummyActionParser.fromValueOrThrow).toHaveBeenCalledWith('CREATE_USER')
    expect(dummyResourceParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(dummyResourceParser.fromValueOrThrow).toHaveBeenCalledWith('USER')
    expect(dummyMetadataParser.fromValueOrThrow).toHaveBeenCalledTimes(1)
    expect(dummyMetadataParser.fromValueOrThrow).toHaveBeenCalledWith('IP_ADDRESS')
  })
})
