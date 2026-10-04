import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserRepository } from '@/repository/user/UserRepository'
import { UserDetails } from '@mudrichenkoevgeny/shared-foundation'

/** Schedules current user account for permanent deletion. */
export class ScheduleUserDeletionUseCase {
  /**
   * Constructs a new {@link ScheduleUserDeletionUseCase}.
   *
   * @param userRepository - User repository
   */
  public constructor(private readonly userRepository: UserRepository) {}

  /**
   * Schedules account deletion.
   *
   * @returns UserDetails or AppError
   */
  public async execute(): Promise<AppResult<UserDetails, AppError>> {
    return this.userRepository.scheduleUserDeletion()
  }
}
