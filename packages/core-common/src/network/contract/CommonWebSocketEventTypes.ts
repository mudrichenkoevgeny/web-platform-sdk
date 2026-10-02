/**
 * Standard WebSocket frame event type constants.
 */
export const CommonWebSocketEventTypes = {
  /** Ping event sent from client to server. */
  PING: 'PING',
  /** Pong acknowledgment response frame. */
  PONG: 'PONG',
  /** Session initialization request frame. */
  INITIALIZE: 'INITIALIZE',
  /** Initialization confirmation frame from server. */
  INITIALIZED_SUCCESS: 'INITIALIZED_SUCCESS'
} as const
