import type { AuditEventPrivatePayload, AuditEventSummaryPayload } from '@mudrichenkoevgeny/shared-foundation'
import {
  AuditActorType,
  AuditStatus,
  toAuditEventIdOrThrow,
  UserAuditActionType,
  UserAuditResourceType
} from '@mudrichenkoevgeny/shared-foundation'

/** Creates mock {@link AuditEventSummaryPayload} instance. */
export const auditEventSummaryPayloadMock = (overrides?: Partial<AuditEventSummaryPayload>): AuditEventSummaryPayload => ({
  id: toAuditEventIdOrThrow('550e8400-e29b-41d4-a716-446655440000'),
  actor_type: AuditActorType.USER,
  action: UserAuditActionType.MANAGEMENT_UPDATE_USER,
  resource: UserAuditResourceType.USER,
  status: AuditStatus.SUCCESS,
  created_at: 1000,
  ...overrides
})

/** Creates mock {@link AuditEventPrivatePayload} instance. */
export const auditEventPrivatePayloadMock = (overrides?: Partial<AuditEventPrivatePayload>): AuditEventPrivatePayload => ({
  id: toAuditEventIdOrThrow('550e8400-e29b-41d4-a716-446655440000'),
  actor_id: null,
  actor_type: AuditActorType.USER,
  actor_user_role: null,
  action: UserAuditActionType.MANAGEMENT_UPDATE_USER,
  resource: UserAuditResourceType.USER,
  resource_id: null,
  status: AuditStatus.SUCCESS,
  metadata: [],
  message: null,
  created_at: 1000,
  updated_at: null,
  ...overrides
})

export const auditEventPayloadMock = auditEventPrivatePayloadMock
