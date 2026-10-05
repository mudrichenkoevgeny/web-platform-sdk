import { describe, it, expect } from 'vitest'
import type { SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SecurityWebSocketMessageHandler } from '@/network/websocket/message-handler/security-web-socket-message-handler'

describe('SecurityWebSocketMessageHandler', () => {
  it('returns NotHandled for unhandled frames', () => {
    const handler = new SecurityWebSocketMessageHandler()
    const frame: SocketFrame = {
      id: 'frame-1',
      type: 'UNKNOWN_TYPE',
      payload: null,
      metadata: {},
      timestamp: Date.now()
    }

    const result = handler.handle(frame)
    expect(result.kind).toBe('NotHandled')
  })
})
