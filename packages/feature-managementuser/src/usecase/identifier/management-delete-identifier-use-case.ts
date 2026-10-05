import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'

/** Administratively removes the identifier record for the given user. */
export class ManagementDeleteIdentifierUseCase {
  /**
   * Constructs a new {@link ManagementDeleteIdentifierUseCase}.
   *
   * @param managementIdentifierRepository - Administrative identifier management repository
   */
  public constructor(private readonly managementIdentifierRepository: ManagementIdentifierRepository) {}

  /**
   * Executes the use case.
   *
   * @param userId - Unique identifier of the record owner
   * @param identifierId - Unique identifier record ID to delete
   * @returns Void result or a mapped failure
   */
  public async execute(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>> {
    return this.managementIdentifierRepository.deleteIdentifier(userId, identifierId)
  }
}
