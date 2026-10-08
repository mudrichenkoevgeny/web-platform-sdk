import type { WebSocketService } from '@/network/websocket/service/web-socket-service'
import type { SocketEventListener } from "@/network/websocket/service/web-socket-service";
import type { WebSocketMessageHandler } from '@/network/websocket/message-handler/web-socket-message-handler'
import type { SocketFrame } from '@/network/model/websocket/socket-frame'
import { CommonWebSocketEventTypes } from '@/network/contract/common-web-socket-event-types'
import { generateErrorId } from '@/error/model/error-id'
/**
 * Mock implementation of {@link WebSocketService} for unit testing WebSocket interactions.
 */
export class WebSocketServiceMock implements WebSocketService {
  public isConnected = false
  public sentFrames: SocketFrame[] = []
  public handlers: WebSocketMessageHandler[] = []
  private readonly listeners = new Set<SocketEventListener>()

  /**
   * Simulates opening a WebSocket connection.
   */
  public connect(): void {
    this.isConnected = true
  }

  /**
   * Simulates closing a WebSocket connection.
   */
  public disconnect(): void {
    this.isConnected = false
  }

  /**
   * Simulates restarting a WebSocket connection.
   */
  public restart(): void {
    this.isConnected = true
  }

  /**
   * Subscribes a listener to incoming socket frame events.
   *
   * @param listener - Callback function triggered on new socket frame
   * @returns Function to unsubscribe the listener
   */
  public observeEvents(listener: SocketEventListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Updates the registered message handlers.
   *
   * @param handlers - Array of message handlers
   */
  public updateWebSocketMessageHandlers(handlers: WebSocketMessageHandler[]): void {
    this.handlers = handlers
  }

  /**
   * Simulates sending a WebSocket event frame.
   *
   * @param type - Event type identifier
   * @param payload - Event body payload
   * @param metadata - Additional metadata key-value pairs
   */
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

  /**
   * Simulates sending a ping frame to the server.
   *
   * @param metadata - Additional metadata
   */
  public async sendPing(metadata?: Record<string, string>): Promise<void> {
    await this.sendEvent(CommonWebSocketEventTypes.PING, null, metadata)
  }

  /**
   * Emits a frame locally to all subscribed event observers.
   *
   * @param frame - Socket frame to broadcast
   */
  public emitFrameLocally(frame: SocketFrame): void {
    for (const listener of this.listeners) {
      listener(frame)
    }
  }
}
