import {
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow,
  UserAuthProvider
} from '@mudrichenkoevgeny/shared-foundation'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link UserIdentifier} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user identifier
 */
export const userIdentifierMock = (
  overrides?: Partial<UserIdentifier>
): UserIdentifier => ({
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
