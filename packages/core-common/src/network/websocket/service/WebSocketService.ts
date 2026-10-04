import type { SocketFrame } from '@/network/model/websocket/SocketFrame'
import type { WebSocketMessageHandler } from '@/network/websocket/messagehandler/WebSocketMessageHandler'

/** Callback listener signature for observing raw socket frame events. */
export type SocketEventListener = (frame: SocketFrame) => void

/**
 * Interface for managing real-time WebSocket connection state and message dispatching.
 */
export interface WebSocketService {
  /** Starts or resumes the WebSocket connection lifecycle. */
  connect(): void
  /** Disconnects and stops the WebSocket connection lifecycle. */
  disconnect(): void
  /** Forces a immediate reconnection restart. */
  restart(): void
  /**
   * Subscribes a listener to unhandled incoming socket frames.
   *
   * @param listener - Callback function triggered on unhandled frames
   * @returns Unsubscribe cleanup function
   */
  observeEvents(listener: SocketEventListener): () => void
  /**
   * Replaces the registered list of message handlers.
   *
   * @param handlers - Array of message handlers
   */
  updateWebSocketMessageHandlers(handlers: WebSocketMessageHandler[]): void
  /**
   * Sends a custom WebSocket event frame.
   *
   * @param type - Event type identifier
   * @param payload - Optional body data
   * @param metadata - Optional metadata dictionary
   */
  sendEvent(
    type: string,
    payload?: unknown,
    metadata?: Record<string, string>
  ): Promise<void>
  /**
   * Dispatches a ping frame to the server.
   *
   * @param metadata - Optional metadata
   */
  sendPing(metadata?: Record<string, string>): Promise<void>
}
