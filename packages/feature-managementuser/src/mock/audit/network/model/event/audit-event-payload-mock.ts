import type { AuditEventPayload } from '@mudrichenkoevgeny/shared-foundation'
import {
  AuditActorType,
  AuditStatus,
  UserAuditActionType,
  UserAuditResourceType
} from '@mudrichenkoevgeny/shared-foundation'

/** Creates mock {@link AuditEventPayload} instance. */
export const auditEventPayloadMock = (overrides?: Partial<AuditEventPayload>): AuditEventPayload => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  actorType: AuditActorType.USER,
  action: UserAuditActionType.MANAGEMENT_UPDATE_USER,
  resource: UserAuditResourceType.USER,
  status: AuditStatus.SUCCESS,
  createdAt: 1000,
  actorId: null,
  actorUserRole: null,
  resourceId: null,
  message: null,
  metadata: [],
  ...overrides
})
