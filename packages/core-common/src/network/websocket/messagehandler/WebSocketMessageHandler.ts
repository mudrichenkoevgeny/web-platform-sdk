import { SocketFrame } from '../../model/websocket/SocketFrame'
import { WebSocketMessageHandlerResult } from './WebSocketMessageHandlerResult'

export interface WebSocketMessageHandler {
  handle(frame: SocketFrame): Promise<WebSocketMessageHandlerResult> | WebSocketMessageHandlerResult
}
