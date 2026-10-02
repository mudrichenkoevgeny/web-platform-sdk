import { WebSocketService, SocketEventListener } from '../network/websocket/service/WebSocketService'
import { WebSocketMessageHandler } from '../network/websocket/messagehandler/WebSocketMessageHandler'
import { SocketFrame } from '../network/model/websocket/SocketFrame'
import { CommonWebSocketEventTypes } from '../network/contract/CommonWebSocketEventTypes'
import { generateErrorId } from '../error/model/ErrorId'

export class WebSocketServiceMock implements WebSocketService {
  public isConnected = false
  public sentFrames: SocketFrame[] = []
  public handlers: WebSocketMessageHandler[] = []
  private readonly listeners = new Set<SocketEventListener>()

  public connect(): void {
    this.isConnected = true
  }

  public disconnect(): void {
    this.isConnected = false
  }

  public restart(): void {
    this.isConnected = true
  }

  public observeEvents(listener: SocketEventListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public updateWebSocketMessageHandlers(handlers: WebSocketMessageHandler[]): void {
    this.handlers = handlers
  }

  public async sendEvent(
    type: string,
    payload?: unknown,
    metadata?: Record<string, string>
  ): Promise<void> {
    const frame: SocketFrame = {
      id: generateErrorId(),
      type,
      payload: payload ?? null,
      metadata: metadata ?? {},
      timestamp: Date.now()
    }
    this.sentFrames.push(frame)
  }

  public async sendPing(metadata?: Record<string, string>): Promise<void> {
    await this.sendEvent(CommonWebSocketEventTypes.PING, null, metadata)
  }

  public emitFrameLocally(frame: SocketFrame): void {
    for (const listener of this.listeners) {
      listener(frame)
    }
  }
}
