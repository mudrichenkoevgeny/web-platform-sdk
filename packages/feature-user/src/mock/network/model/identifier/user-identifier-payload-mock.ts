import {
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow,
  UserAuthProvider,
  UserIdentifierPayload
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link UserIdentifierPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user identifier payload
 */
export const userIdentifierPayloadMock = (
  overrides?: Partial<UserIdentifierPayload>
): UserIdentifierPayload => ({
  id: toUserIdentifierIdOrThrow('223e4567-e89b-12d3-a456-426614174001'),
  user_id: toUserIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
  user_auth_provider: UserAuthProvider.EMAIL,
  identifier: 'user@example.com',
  display_name: 'user@example.com',
  external_provider_email: null,
  is_sensitive_values_masked: false,
  created_at: 0,
  updated_at: null,
  ...overrides
})
