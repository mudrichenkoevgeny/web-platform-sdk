import type { AuditEventId, UserIdentifierId, UserSessionId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AuditEventListParams } from '@/ui/screens/management/audit/list/AuditEventListStore'

export type ManagementDestination =
  | { type: 'main' }
  | { type: 'edit_auth_settings' }
  | { type: 'edit_global_settings' }
  | { type: 'edit_security_settings' }
  | { type: 'global_user_list' }
  | { type: 'create_user' }
  | { type: 'user_detail'; userId: UserId }
  | { type: 'user_session_list'; userId: UserId }
  | { type: 'user_identifier_list'; userId: UserId }
  | { type: 'audit_event_list'; params?: AuditEventListParams }
  | { type: 'audit_event_detail'; eventId: AuditEventId }
  | { type: 'global_session_list' }
  | { type: 'session_detail'; sessionId: UserSessionId }
  | { type: 'global_identifier_list' }
  | { type: 'identifier_detail'; identifierId: UserIdentifierId }
