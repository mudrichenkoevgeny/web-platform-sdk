import { CommonWebSocketEventTypes } from '../../contract/CommonWebSocketEventTypes'
import { SocketFrame } from '../../model/websocket/SocketFrame'
import { WebSocketMessageHandler } from './WebSocketMessageHandler'
import {
  WebSocketMessageHandlerResult,
  webSocketMessageHandlerResultHandled,
  webSocketMessageHandlerResultNotHandled,
  webSocketMessageHandlerResultSend
} from './WebSocketMessageHandlerResult'
import { generateErrorId } from '../../../error/model/ErrorId'

export class CommonWebSocketMessageHandler implements WebSocketMessageHandler {
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
