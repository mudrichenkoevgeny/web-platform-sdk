import {
  AccountLockoutType,
  toUserIdOrThrow,
  UserAccountStatus,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link UserPrivate} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user private details
 */
export const userPrivateMock = (
  overrides?: Partial<UserPrivate>
): UserPrivate => ({
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
  lockoutType: AccountLockoutType.NONE,
  temporaryLockoutUntil: null,
  ...overrides
})

export const userDetailsMock = userPrivateMock

/**
 * Creates a mock {@link UserSummary} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user summary
 */
export const userSummaryMock = (
  overrides?: Partial<import('@mudrichenkoevgeny/shared-foundation').UserSummary>
): import('@mudrichenkoevgeny/shared-foundation').UserSummary => ({
  id: toUserIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
  role: UserRole.CLIENT_USER,
  accountStatus: UserAccountStatus.ACTIVE,
  ...overrides
})
