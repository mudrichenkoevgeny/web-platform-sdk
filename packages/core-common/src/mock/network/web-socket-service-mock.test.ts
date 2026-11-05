import { describe, it, expect, vi } from 'vitest'
import { WebSocketServiceMock } from '@/mock/network/web-socket-service-mock'

describe('WebSocketServiceMock', () => {
  it('WebSocketServiceMock manages connect, frame sending and local emission', async () => {
    const service = new WebSocketServiceMock()
    const listener = vi.fn()
    service.observeEvents(listener)

    service.connect()
    expect(service.isConnected).toBe(true)

    await service.sendPing()
    expect(service.sentFrames.length).toBe(1)
    expect(service.sentFrames[0]!.type).toBe('PING')

    service.emitFrameLocally(service.sentFrames[0]!)
    expect(listener).toHaveBeenCalledWith(service.sentFrames[0])

    service.disconnect()
    expect(service.isConnected).toBe(false)
  })
})
