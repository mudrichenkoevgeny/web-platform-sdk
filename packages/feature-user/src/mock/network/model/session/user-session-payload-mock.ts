import {
  ClientType,
  toClientDeviceIdOrThrow,
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow,
  toUserSessionIdOrThrow,
  UserAuthProvider,
  UserRole,
  UserSessionPayload
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link UserSessionPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user session payload
 */
export const userSessionPayloadMock = (
  overrides?: Partial<UserSessionPayload>
): UserSessionPayload => ({
  id: toUserSessionIdOrThrow('sess_123'),
  user_id: toUserIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
  user_role: UserRole.CLIENT_USER,
  identifier: 'user@example.com',
  identifier_display_name: 'user@example.com',
  identifier_id: toUserIdentifierIdOrThrow('ident_123'),
  identifier_auth_provider: UserAuthProvider.EMAIL,
  client_device_info: {
    client_type: ClientType.WEB,
    language: 'en',
    device_id: toClientDeviceIdOrThrow('dev_123'),
    device_name: 'Chrome',
    app_version: '1.0.0',
    operation_system_version: 'macOS'
  },
  user_agent: 'Mozilla/5.0',
  ip_address: '127.0.0.1',
  expires_at: 1717244400000,
  last_accessed_at: 1717240800000,
  last_reauthenticated_at: 1717240800000,
  is_sensitive_values_masked: false,
  created_at: 1717200000000,
  updated_at: 1717200000000,
  ...overrides
})
