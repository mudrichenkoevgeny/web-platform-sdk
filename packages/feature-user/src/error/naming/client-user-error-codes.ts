/**
 * Stable string codes for errors raised on the client before or outside backend UserErrorCodes.
 */
export const ClientUserErrorCodes = {
  EXTERNAL_AUTH_CANCELLED: 'EXTERNAL_AUTH_CANCELLED',
  EXTERNAL_AUTH_FAILED: 'EXTERNAL_AUTH_FAILED',
  TOO_MANY_CONFIRMATION_REQUESTS: 'TOO_MANY_CONFIRMATION_REQUESTS',
  REGISTRATION_DISABLED: 'REGISTRATION_DISABLED'
} as const
