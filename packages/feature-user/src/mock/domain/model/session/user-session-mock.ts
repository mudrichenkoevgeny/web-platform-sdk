import {
  ClientType,
  toClientDeviceIdOrThrow,
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow,
  toUserSessionIdOrThrow,
  UserAuthProvider,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link UserSession} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user session
 */
export const userSessionMock = (
  overrides?: Partial<UserSession>
): UserSession => ({
  id: toUserSessionIdOrThrow('sess_123'),
  userId: toUserIdOrThrow('usr_123'),
  userRole: UserRole.CLIENT_USER,
  identifier: 'user@example.com',
  identifierId: toUserIdentifierIdOrThrow('ident_123'),
  identifierDisplayName: 'user@example.com',
  identifierAuthProvider: UserAuthProvider.EMAIL,
  deviceInfo: {
    clientType: ClientType.WEB,
    language: 'en',
    deviceId: toClientDeviceIdOrThrow('dev_123'),
    deviceName: 'Chrome',
    appVersion: '1.0.0',
    operationSystemVersion: 'macOS'
  },
  userAgent: 'MockUserAgent/1.0',
  ipAddress: '127.0.0.1',
  expiresAt: Date.now() + 30 * 86400 * 1000,
  lastAccessedAt: Date.now(),
  lastReauthenticatedAt: Date.now(),
  isSensitiveValuesMasked: false,
  createdAt: Date.now(),
  updatedAt: null,
  ...overrides
})
