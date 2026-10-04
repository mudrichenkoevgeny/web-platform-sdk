import {
  AccountLockoutType,
  toUserIdOrThrow,
  UserAccountStatus,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import { UserDetails } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link UserDetails} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user details
 */
export const userDetailsMock = (
  overrides?: Partial<UserDetails>
): UserDetails => ({
  id: toUserIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
  role: UserRole.CLIENT_USER,
  accountStatus: UserAccountStatus.ACTIVE,
  accountStatusOnRestore: null,
  authorityLevel: 0,
  permissionCodes: [],
  isTotpEnabled: false,
  lastLoginAt: null,
  lastActiveAt: null,
  createdAt: Date.now(),
  updatedAt: null,
  scheduledPermanentDeletionAt: null,
  accountLockoutType: AccountLockoutType.NONE,
  temporaryLockoutUntil: null,
  ...overrides
})
