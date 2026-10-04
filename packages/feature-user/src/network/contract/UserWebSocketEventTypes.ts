/**
 * User-related WebSocket event types for user status and session updates.
 */
export const UserWebSocketEventTypes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  USER_UPDATED: 'USER_UPDATED',
  SESSION_DELETED: 'SESSION_DELETED'
} as const
