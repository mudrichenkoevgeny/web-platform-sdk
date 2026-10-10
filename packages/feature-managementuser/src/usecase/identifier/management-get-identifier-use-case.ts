import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierId, UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'

/** Administratively retrieves specific identifier details. */
export class ManagementGetIdentifierUseCase {
  /**
   * Constructs a new {@link ManagementGetIdentifierUseCase}.
   *
   * @param managementIdentifierRepository - Administrative identifier management repository
   */
  public constructor(private readonly managementIdentifierRepository: ManagementIdentifierRepository) {}

  /**
   * Executes the use case.
   *
   * @param identifierId - Unique identifier record ID
   * @returns Detailed information of the target identifier, or a mapped failure
   */
  public async execute(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    return this.managementIdentifierRepository.getIdentifier(identifierId)
  }
}
