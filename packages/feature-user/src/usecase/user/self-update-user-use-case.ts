import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserRepository } from '@/repository/user/user-repository'
import type {
  AccountLockoutType,
  FileId,
  Instant,
  PermissionCode,
  UserAccountStatus,
  UserPrivate,
  UserStorageConfiguration
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Universal domain-layer parameter holder for updating user account details, profile, or administrative settings.
 */
export interface UpdateUserParams {
  nickname?: string | null
  displayName?: string | null
  avatarFileId?: FileId | string | null
  birthdate?: Instant | number | null
  accountStatus?: UserAccountStatus | null
  authorityLevel?: number | null
  permissionCodes?: PermissionCode[] | null
  accountLockoutType?: AccountLockoutType | null
  lockoutType?: AccountLockoutType | null
  temporaryLockoutUntil?: number | null
  storageConfiguration?: UserStorageConfiguration | null
}

/** Partially updates account details and profile fields of the currently authenticated user. */
export class SelfUpdateUserUseCase {
  /**
   * Constructs a new {@link SelfUpdateUserUseCase}.
   *
   * @param userRepository - User repository
   */
  public constructor(private readonly userRepository: UserRepository) {}

  /**
   * Executes self profile update.
   *
   * @param params - Domain model with partial profile update fields
   * @returns Updated UserPrivate or AppError
   */
  public async execute(params: UpdateUserParams): Promise<AppResult<UserPrivate, AppError>> {
    return this.userRepository.selfUpdateUser(params)
  }
}
