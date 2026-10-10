import {
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow,
  UserAuthProvider
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierPrivate, UserIdentifierSummary } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link UserIdentifierPrivate} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user identifier private
 */
export const userIdentifierPrivateMock = (
  overrides?: Partial<UserIdentifierPrivate>
): UserIdentifierPrivate => ({
  id: toUserIdentifierIdOrThrow('223e4567-e89b-12d3-a456-426614174001'),
  userId: toUserIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
  userAuthProvider: UserAuthProvider.EMAIL,
  identifier: 'user@example.com',
  displayName: 'user@example.com',
  externalProviderEmail: null,
  isSensitiveValuesMasked: false,
  createdAt: Date.now(),
  updatedAt: null,
  ...overrides
})

/**
 * Creates a mock {@link UserIdentifierSummary} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user identifier summary
 */
export const userIdentifierSummaryMock = (
  overrides?: Partial<UserIdentifierSummary>
): UserIdentifierSummary => ({
  id: toUserIdentifierIdOrThrow('223e4567-e89b-12d3-a456-426614174001'),
  userAuthProvider: UserAuthProvider.EMAIL,
  identifier: 'user@example.com',
  displayName: 'user@example.com',
  ...overrides
})

export const userIdentifierMock = userIdentifierPrivateMock
