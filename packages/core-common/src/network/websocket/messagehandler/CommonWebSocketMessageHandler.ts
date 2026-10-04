import { CommonWebSocketEventTypes } from '@/contract/CommonWebSocketEventTypes'
import type { SocketFrame } from '@/model/websocket/SocketFrame'
import type { WebSocketMessageHandler } from '@/network/websocket/messagehandler/WebSocketMessageHandler'
import {
  webSocketMessageHandlerResultHandled,
  webSocketMessageHandlerResultNotHandled,
  webSocketMessageHandlerResultSend
} from '@/network/websocket/messagehandler/WebSocketMessageHandlerResult'
import type { WebSocketMessageHandlerResult } from "@/network/websocket/messagehandler/WebSocketMessageHandlerResult";
import { generateErrorId } from '@/error/model/ErrorId'
/**
 * Framework message handler managing system WebSocket events such as PING/PONG and INITIALIZE.
 */
export class CommonWebSocketMessageHandler implements WebSocketMessageHandler {
  /**
   * Handles framework-level WebSocket frames.
   *
   * @param frame - Incoming socket frame
   * @returns {@link WebSocketMessageHandlerResult}
   */
  public handle(frame: SocketFrame): WebSocketMessageHandlerResult {
    switch (frame.type) {
      case CommonWebSocketEventTypes.PING:
        return this.handlePing()
      case CommonWebSocketEventTypes.PONG:
      case CommonWebSocketEventTypes.INITIALIZE:
      case CommonWebSocketEventTypes.INITIALIZED_SUCCESS:
        return webSocketMessageHandlerResultHandled()
      default:
        return webSocketMessageHandlerResultNotHandled()
    }
  }

  private handlePing(): WebSocketMessageHandlerResult {
    return webSocketMessageHandlerResultSend({
      id: generateErrorId(),
      type: CommonWebSocketEventTypes.PONG,
      payload: null,
      metadata: {},
      timestamp: Date.now()
    })
  }
}
