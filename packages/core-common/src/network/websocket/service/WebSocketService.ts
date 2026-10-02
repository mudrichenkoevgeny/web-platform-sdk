import { SocketFrame } from '../../model/websocket/SocketFrame'
import { WebSocketMessageHandler } from '../messagehandler/WebSocketMessageHandler'

export type SocketEventListener = (frame: SocketFrame) => void

export interface WebSocketService {
  connect(): void
  disconnect(): void
  restart(): void
  observeEvents(listener: SocketEventListener): () => void
  updateWebSocketMessageHandlers(handlers: WebSocketMessageHandler[]): void
  sendEvent(
    type: string,
    payload?: unknown,
    metadata?: Record<string, string>
  ): Promise<void>
  sendPing(metadata?: Record<string, string>): Promise<void>
}
