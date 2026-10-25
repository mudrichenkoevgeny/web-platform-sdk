import { describe, it, expect } from 'vitest'
import type { SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import { StorageWebSocketMessageHandler } from './storage-web-socket-message-handler'

describe('StorageWebSocketMessageHandler', () => {
  const handler = new StorageWebSocketMessageHandler()

  it('returns NotHandled as storage events are processed directly by repositories', () => {
    const frame: SocketFrame = {
      id: 'frame-1',
      type: StorageWebSocketEventTypes.STORAGE_FILE_UPDATED,
      payload: {
        fileId: 'file-123'
      },
      metadata: {},
      timestamp: Date.now()
    }

    const result = handler.handle(frame)
    expect(result.kind).toBe('NotHandled')
  })
})
