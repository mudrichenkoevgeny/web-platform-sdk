import { describe, it, expect } from 'vitest'
import type { WebSocketMessageHandler } from '@/network/websocket/message-handler/web-socket-message-handler'
import type { SocketFrame } from '@/network/model/websocket/socket-frame'
import {
  webSocketMessageHandlerResultHandled,
  webSocketMessageHandlerResultNotHandled
} from '@/network/websocket/message-handler/web-socket-message-handler-result'

describe('WebSocketMessageHandler', () => {
  it('allows handler implementation to process socket frames', async () => {
    const handler: WebSocketMessageHandler = {
      handle(frame: SocketFrame) {
        if (frame.type === 'PONG') {
          return webSocketMessageHandlerResultHandled()
        }
        return webSocketMessageHandlerResultNotHandled()
      }
    }

    const pongFrame: SocketFrame = { id: 'frame-1', type: 'PONG', timestamp: Date.now() }
    const pingFrame: SocketFrame = { id: 'frame-2', type: 'PING', timestamp: Date.now() }

    expect(await handler.handle(pongFrame)).toEqual({ kind: 'Handled' })
    expect(await handler.handle(pingFrame)).toEqual({ kind: 'NotHandled' })
  })
})
