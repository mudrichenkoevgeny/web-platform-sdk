import type { AuditEventPrivate, AuditEventSummary } from '@mudrichenkoevgeny/shared-foundation'
import {
  AuditActorType,
  AuditStatus,
  toAuditEventIdOrThrow,
  UserAuditActionType,
  UserAuditResourceType
} from '@mudrichenkoevgeny/shared-foundation'

/** Creates mock {@link AuditEventSummary} instance. */
export const auditEventSummaryMock = (overrides?: Partial<AuditEventSummary>): AuditEventSummary => ({
  id: toAuditEventIdOrThrow('550e8400-e29b-41d4-a716-446655440000'),
  actorType: AuditActorType.USER,
  action: UserAuditActionType.MANAGEMENT_UPDATE_USER,
  resource: UserAuditResourceType.USER,
  status: AuditStatus.SUCCESS,
  createdAt: 1000,
  ...overrides
})

/** Creates mock {@link AuditEventPrivate} instance. */
export const auditEventPrivateMock = (overrides?: Partial<AuditEventPrivate>): AuditEventPrivate => ({
  id: toAuditEventIdOrThrow('550e8400-e29b-41d4-a716-446655440000'),
  actorId: null,
  actorType: AuditActorType.USER,
  actorUserRole: null,
  action: UserAuditActionType.MANAGEMENT_UPDATE_USER,
  resource: UserAuditResourceType.USER,
  resourceId: null,
  status: AuditStatus.SUCCESS,
  metadata: [],
  message: null,
  createdAt: 1000,
  updatedAt: null,
  ...overrides
})

export const auditEventMock = auditEventPrivateMock
