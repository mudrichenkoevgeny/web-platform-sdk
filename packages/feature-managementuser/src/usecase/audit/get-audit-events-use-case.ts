import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditEventSummary,
  ManagementAuditEventListParams,
  PagedResult
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditRepository } from '@/repository/audit/management-audit-repository'

/** Returns a paginated list of audit events for administrative purposes. */
export class GetAuditEventsUseCase {
  /**
   * Constructs a new {@link GetAuditEventsUseCase}.
   *
   * @param managementAuditRepository - Administrative audit repository
   */
  public constructor(private readonly managementAuditRepository: ManagementAuditRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Query and filter parameters
   * @returns Paginated result containing audit event summaries, or a failure
   */
  public async execute(
    params?: ManagementAuditEventListParams
  ): Promise<AppResult<PagedResult<AuditEventSummary>, AppError>> {
    return this.managementAuditRepository.getAuditEvents(params)
  }
}

