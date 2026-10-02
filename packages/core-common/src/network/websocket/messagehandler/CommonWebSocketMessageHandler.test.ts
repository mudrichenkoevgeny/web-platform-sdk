import { describe, it, expect } from 'vitest'
import { CommonWebSocketMessageHandler } from './CommonWebSocketMessageHandler'
import { CommonWebSocketEventTypes } from '../../contract/CommonWebSocketEventTypes'
import { SocketFrame } from '../../model/websocket/SocketFrame'

describe('CommonWebSocketMessageHandler', () => {
  const handler = new CommonWebSocketMessageHandler()

  it('handles PING by returning SendSocketFrame for PONG', () => {
    const pingFrame: SocketFrame = {
      id: 'frame-1',
      type: CommonWebSocketEventTypes.PING,
      timestamp: Date.now()
    }

    const result = handler.handle(pingFrame)

    expect(result.kind).toBe('SendSocketFrame')
    if (result.kind === 'SendSocketFrame') {
      expect(result.socketFrame.type).toBe(CommonWebSocketEventTypes.PONG)
    }
  })

  it('handles PONG, INITIALIZE, INITIALIZED_SUCCESS as Handled', () => {
    const types = [
      CommonWebSocketEventTypes.PONG,
      CommonWebSocketEventTypes.INITIALIZE,
      CommonWebSocketEventTypes.INITIALIZED_SUCCESS
    ]

    for (const type of types) {
      const frame: SocketFrame = { id: 'frame-2', type, timestamp: Date.now() }
      expect(handler.handle(frame).kind).toBe('Handled')
    }
  })

  it('returns NotHandled for unknown event type', () => {
    const frame: SocketFrame = { id: 'frame-3', type: 'CUSTOM_EVENT', timestamp: Date.now() }
    expect(handler.handle(frame).kind).toBe('NotHandled')
  })
})
