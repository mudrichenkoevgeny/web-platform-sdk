/**
 * Structured WebSocket message frame payload exchanged with the server.
 */
export interface SocketFrame {
  /** Unique message frame identifier. */
  readonly id: string
  /** Message frame type discriminator. */
  readonly type: string
  /** Optional JSON payload content. */
  readonly payload?: unknown
  /** Optional metadata key-value parameters. */
  readonly metadata?: Record<string, string>
  /** Epoch timestamp in milliseconds when the frame was created. */
  readonly timestamp: number
}
