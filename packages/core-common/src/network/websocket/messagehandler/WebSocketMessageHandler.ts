import { SocketFrame } from '@/model/websocket/SocketFrame'
import { WebSocketMessageHandlerResult } from './WebSocketMessageHandlerResult'

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
