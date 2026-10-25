import {
  webSocketMessageHandlerResultNotHandled
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  WebSocketMessageHandler,
  WebSocketMessageHandlerResult,
  SocketFrame
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * WebSocket message handler for storage domain frame types.
 * Note: Real-time storage file updates (`STORAGE_FILE_UPDATED`) and settings updates
 * (`OPEN_STORAGE_SETTINGS_UPDATED`, `MANAGEMENT_STORAGE_SETTINGS_UPDATED`) are processed
 * directly by their respective repository implementations.
 */
export class StorageWebSocketMessageHandler implements WebSocketMessageHandler {
  /**
   * Processes incoming storage WebSocket message frame.
   *
   * @param frame - Incoming socket frame
   * @returns {@link WebSocketMessageHandlerResult}
   */
  public handle(_frame: SocketFrame): WebSocketMessageHandlerResult {
    return webSocketMessageHandlerResultNotHandled()
  }
}
