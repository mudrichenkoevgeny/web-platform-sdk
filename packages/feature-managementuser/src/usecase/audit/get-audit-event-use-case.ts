import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuditEvent } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditRepository } from '@/repository/audit/management-audit-repository'

/** Retrieves full details of a specific audit event. */
export class GetAuditEventUseCase {
  /**
   * Constructs a new {@link GetAuditEventUseCase}.
   *
   * @param managementAuditRepository - Administrative audit repository
   */
  public constructor(private readonly managementAuditRepository: ManagementAuditRepository) {}

  /**
   * Executes the use case.
   *
   * @param eventId - Unique audit event identifier string
   * @returns Detailed audit event model, or a failure
   */
  public async execute(eventId: string): Promise<AppResult<AuditEvent, AppError>> {
    return this.managementAuditRepository.getAuditEvent(eventId)
  }
}
