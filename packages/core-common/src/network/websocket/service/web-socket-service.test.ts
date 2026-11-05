import { describe, it, expect, vi } from 'vitest'
import type { WebSocketService, SocketEventListener } from '@/network/websocket/service/web-socket-service'
import type { WebSocketMessageHandler } from '@/network/websocket/message-handler/web-socket-message-handler'

describe('WebSocketService', () => {
  it('allows implementation of WebSocketService interface methods', async () => {
    let isConnected = false
    const listeners: SocketEventListener[] = []
    let currentHandlers: WebSocketMessageHandler[] = []
    const sentEvents: Array<{ type: string; payload?: unknown; metadata?: Record<string, string> }> = []

    const mockService: WebSocketService = {
      connect() {
        isConnected = true
      },
      disconnect() {
        isConnected = false
      },
      restart() {
        mockService.disconnect()
        mockService.connect()
      },
      observeEvents(listener: SocketEventListener) {
        listeners.push(listener)
        return () => {
          const index = listeners.indexOf(listener)
          if (index !== -1) {
            listeners.splice(index, 1)
          }
        }
      },
      updateWebSocketMessageHandlers(handlers: WebSocketMessageHandler[]) {
        currentHandlers = handlers
      },
      async sendEvent(type: string, payload?: unknown, metadata?: Record<string, string>) {
        sentEvents.push({ type, payload, metadata })
      },
      async sendPing(metadata?: Record<string, string>) {
        await mockService.sendEvent('PING', undefined, metadata)
      }
    }

    mockService.connect()
    expect(isConnected).toBe(true)

    const mockListener = vi.fn()
    const unsubscribe = mockService.observeEvents(mockListener)
    expect(listeners.length).toBe(1)
    unsubscribe()
    expect(listeners.length).toBe(0)

    const dummyHandler: WebSocketMessageHandler = {
      handle: () => ({ kind: 'Handled' })
    }
    mockService.updateWebSocketMessageHandlers([dummyHandler])
    expect(currentHandlers.length).toBe(1)

    await mockService.sendEvent('CUSTOM', { key: 'val' })
    await mockService.sendPing({ traceId: '123' })
    expect(sentEvents).toEqual([
      { type: 'CUSTOM', payload: { key: 'val' }, metadata: undefined },
      { type: 'PING', payload: undefined, metadata: { traceId: '123' } }
    ])

    mockService.restart()
    expect(isConnected).toBe(true)

    mockService.disconnect()
    expect(isConnected).toBe(false)
  })
})
