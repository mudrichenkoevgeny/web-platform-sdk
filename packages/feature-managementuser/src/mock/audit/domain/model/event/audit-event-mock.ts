import type { AuditEvent } from '@mudrichenkoevgeny/shared-foundation'
import {
  AuditActorType,
  AuditStatus,
  AuditValueSensitivity,
  toAuditEventIdOrThrow,
  UserAuditActionType,
  UserAuditResourceType
} from '@mudrichenkoevgeny/shared-foundation'

/** Creates mock {@link AuditEvent} instance. */
export const auditEventMock = (overrides?: Partial<AuditEvent>): AuditEvent => ({
  id: toAuditEventIdOrThrow('550e8400-e29b-41d4-a716-446655440000'),
  actorId: null,
  actorType: AuditActorType.USER,
  actorUserRole: null,
  action: UserAuditActionType.MANAGEMENT_UPDATE_USER,
  resource: UserAuditResourceType.USER,
  resourceId: null,
  resourceValueSensitivity: AuditValueSensitivity.NON_SENSITIVE,
  status: AuditStatus.SUCCESS,
  metadata: [],
  message: null,
  createdAt: 0,
  ...overrides
})
