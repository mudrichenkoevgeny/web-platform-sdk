import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { CreateByEmailRequest, UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserRepository } from '@/repository/user/ManagementUserRepository'

/** Administratively creates a new user account. */
export class CreateUserUseCase {
  /**
   * Constructs a new {@link CreateUserUseCase}.
   *
   * @param managementUserRepository - Administrative user management repository
   */
  public constructor(private readonly managementUserRepository: ManagementUserRepository) {}

  /**
   * Executes the use case.
   *
   * @param request - Payload details for creating an account via email
   * @returns Detailed information of the newly created user domain model, or a mapped failure
   */
  public async execute(request: CreateByEmailRequest): Promise<AppResult<UserDetails, AppError>> {
    return this.managementUserRepository.createUser(request)
  }
}
