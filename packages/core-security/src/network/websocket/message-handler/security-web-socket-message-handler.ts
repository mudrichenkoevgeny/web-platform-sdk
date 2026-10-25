import {
  webSocketMessageHandlerResultNotHandled
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  WebSocketMessageHandler,
  WebSocketMessageHandlerResult,
  SocketFrame
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * WebSocket message handler for security domain frame types.
 * Note: Real-time security settings updates are processed directly by {@link OpenSecuritySettingsRepositoryImpl}.
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
