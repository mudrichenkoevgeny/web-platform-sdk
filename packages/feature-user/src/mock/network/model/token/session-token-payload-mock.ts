import {
  SessionTokenPayload,
  toUserIdentifierIdOrThrow,
  toUserSessionIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link SessionTokenPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock session token payload
 */
export const sessionTokenPayloadMock = (
  overrides?: Partial<SessionTokenPayload>
): SessionTokenPayload => ({
  access_token: 'access-token',
  refresh_token: 'refresh-token',
  expires_at: 99,
  token_type: 'Bearer',
  session_id: toUserSessionIdOrThrow('sess_123'),
  identifier_id: toUserIdentifierIdOrThrow('ident_123'),
  ...overrides
})
