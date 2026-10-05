import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId, UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'

/** Administratively removes the password credential for the given user's identifier record. */
export class ManagementDeleteIdentifierPasswordUseCase {
  /**
   * Constructs a new {@link ManagementDeleteIdentifierPasswordUseCase}.
   *
   * @param managementIdentifierRepository - Administrative identifier management repository
   */
  public constructor(private readonly managementIdentifierRepository: ManagementIdentifierRepository) {}

  /**
   * Executes the use case.
   *
   * @param userId - Unique identifier of the record owner
   * @param identifierId - Unique identifier record ID to remove password for
   * @returns Void result or a mapped failure
   */
  public async execute(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return this.managementIdentifierRepository.deleteIdentifierPassword(userId, identifierId)
  }
}
