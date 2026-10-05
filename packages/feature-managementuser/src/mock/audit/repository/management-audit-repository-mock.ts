import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditActorType,
  AuditEvent,
  AuditEventSortBy,
  AuditStatus,
  PagedResult,
  SortOrder,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditRepository } from '@/repository/audit/management-audit-repository'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'

/** Mock implementation of {@link ManagementAuditRepository}. */
export class ManagementAuditRepositoryMock implements ManagementAuditRepository {
  public getAuditEventsResult: AppResult<PagedResult<AuditEvent>, AppError> = appResultSuccess({
    items: [auditEventMock()],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1
  })
  public getAuditEventResult: AppResult<AuditEvent, AppError> = appResultSuccess(auditEventMock())

  public async getAuditEvents(
    _pageNumber?: number | null,
    _pageSize?: number | null,
    _sortBy?: AuditEventSortBy | null,
    _sortOrder?: SortOrder | null,
    _actorIds?: string[] | null,
    _actorTypes?: AuditActorType[] | null,
    _actorUserRoles?: UserRole[] | null,
    _actions?: string[] | null,
    _resources?: string[] | null,
    _resourceIds?: string[] | null,
    _statuses?: AuditStatus[] | null,
    _messages?: string[] | null
  ): Promise<AppResult<PagedResult<AuditEvent>, AppError>> {
    return this.getAuditEventsResult
  }

  public async getAuditEvent(_eventId: string): Promise<AppResult<AuditEvent, AppError>> {
    return this.getAuditEventResult
  }
}
