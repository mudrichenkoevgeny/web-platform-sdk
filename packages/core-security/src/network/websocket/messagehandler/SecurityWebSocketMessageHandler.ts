import {
  WebSocketMessageHandler,
  WebSocketMessageHandlerResult,
  webSocketMessageHandlerResultNotHandled,
  SocketFrame
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * WebSocket message handler for security domain frame types.
 */
export class SecurityWebSocketMessageHandler implements WebSocketMessageHandler {
  /**
   * Processes incoming security WebSocket message frame.
   *
   * @param frame - Incoming socket frame
   * @returns {@link WebSocketMessageHandlerResult}
   */
  public handle(_frame: SocketFrame): WebSocketMessageHandlerResult {
    return webSocketMessageHandlerResultNotHandled()
  }
}
