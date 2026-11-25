import type { SocketFrame } from '@/core/common/network/model/websocket/socket-frame'
import type { WebSocketMessageHandlerResult } from '@/core/common/network/websocket/message-handler/web-socket-message-handler-result'

/**
 * Handler interface processing incoming WebSocket frames in a Chain of Responsibility.
 */
export interface WebSocketMessageHandler {
  /**
   * Processes an incoming WebSocket message frame.
   *
   * @param frame - Incoming socket frame payload
   * @returns {@link WebSocketMessageHandlerResult} indicating outcome
   */
  handle(frame: SocketFrame): Promise<WebSocketMessageHandlerResult> | WebSocketMessageHandlerResult
}
