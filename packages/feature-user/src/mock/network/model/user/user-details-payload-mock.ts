import {
  AccountLockoutType,
  toUserIdOrThrow,
  UserAccountStatus,
  UserDetailsPayload,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link UserDetailsPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user details payload
 */
export const userDetailsPayloadMock = (
  overrides?: Partial<UserDetailsPayload>
): UserDetailsPayload => ({
  id: toUserIdOrThrow('123e4567-e89b-12d3-a456-426614174000'),
  role: UserRole.CLIENT_USER,
  account_status: UserAccountStatus.ACTIVE,
  account_status_on_restore: null,
  authority_level: 0,
  permission_codes: [],
  is_totp_enabled: false,
  last_login_at: null,
  last_active_at: null,
  created_at: 1,
  updated_at: null,
  scheduled_permanent_deletion_at: null,
  account_lockout_type: AccountLockoutType.NONE,
  temporary_lockout_until: null,
  ...overrides
})
