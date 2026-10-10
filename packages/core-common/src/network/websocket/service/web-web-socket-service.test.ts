import { describe, it, expect, vi } from 'vitest'
import { WebWebSocketService } from '@/network/websocket/service/web-web-socket-service'
import { AccessTokenProviderMock } from '@/mock/network/access-token-provider-mock'
import { WebClientDeviceInfoProvider } from '@/platform/device-info/client-device-info-provider'
import { EncryptedCommonStorage } from '@/storage/common/encrypted-common-storage'
import { createInMemoryEncryptedSettings } from '@/mock/storage/encrypted-settings-mock'
import { CommonWebSocketMessageHandler } from '@/network/websocket/message-handler/common-web-socket-message-handler'
import type { SocketFrame } from '@/network/model/websocket/socket-frame'
import { CommonWebSocketEventTypes } from '@/network/contract/common-web-socket-event-types'

class MockWebSocket {
  public readyState = 1 // OPEN
  public sentMessages: string[] = []
  public onopen: (() => void) | null = null
  public onmessage: ((event: { data: string }) => void) | null = null
  public onclose: (() => void) | null = null
  public onerror: ((error: unknown) => void) | null = null

  public send(data: string): void {
    this.sentMessages.push(data)
  }

  public close(): void {
    this.readyState = 3 // CLOSED
    if (this.onclose) {
      this.onclose()
    }
  }

  public triggerOpen(): void {
    if (this.onopen) {
      this.onopen()
    }
  }

  public triggerMessage(frame: SocketFrame): void {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(frame) })
    }
  }
}

describe('WebWebSocketService', () => {
  const createTestService = (mockWs: MockWebSocket) => {
    const tokenProvider = new AccessTokenProviderMock('initial-token')
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)
    const clientDeviceInfoProvider = new WebClientDeviceInfoProvider(storage)

    const service = new WebWebSocketService({
      baseUrl: 'https://api.example.com',
      webSocketPath: '/ws',
      accessTokenProvider: tokenProvider,
      clientDeviceInfoProvider,
      webSocketFactory: () => mockWs as unknown as WebSocket
    })

    return { service, tokenProvider, mockWs }
  }

  it('connects to wss URL with token query parameter and sends INITIALIZE frame', async () => {
    const mockWs = new MockWebSocket()
    const { service } = createTestService(mockWs)

    service.connect()
    mockWs.triggerOpen()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockWs.sentMessages.length).toBeGreaterThan(0)
    const initFrame = JSON.parse(mockWs.sentMessages[0]!) as SocketFrame
    expect(initFrame.type).toBe(CommonWebSocketEventTypes.INITIALIZE)
  })

  it('routes incoming PING frame to CommonWebSocketMessageHandler and sends PONG', async () => {
    const mockWs = new MockWebSocket()
    const { service } = createTestService(mockWs)
    service.updateWebSocketMessageHandlers([new CommonWebSocketMessageHandler()])

    service.connect()
    mockWs.triggerOpen()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const pingFrame: SocketFrame = { id: 'frame-ping', type: CommonWebSocketEventTypes.PING, timestamp: Date.now() }
    mockWs.triggerMessage(pingFrame)
    await new Promise((resolve) => setTimeout(resolve, 0))

    const pongMessage = mockWs.sentMessages.find(msg => msg.includes(CommonWebSocketEventTypes.PONG))
    expect(pongMessage).toBeDefined()
  })

  it('emits unhandled events to observeEvents listeners', async () => {
    const mockWs = new MockWebSocket()
    const { service } = createTestService(mockWs)
    service.updateWebSocketMessageHandlers([new CommonWebSocketMessageHandler()])

    const eventListener = vi.fn()
    service.observeEvents(eventListener)

    service.connect()
    mockWs.triggerOpen()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const customFrame: SocketFrame = { id: 'frame-custom', type: 'CUSTOM_EVENT', timestamp: Date.now() }
    mockWs.triggerMessage(customFrame)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(eventListener).toHaveBeenCalledWith(customFrame)
  })

  it('restarts connection when access token changes', async () => {
    const mockWs = new MockWebSocket()
    const { service, tokenProvider } = createTestService(mockWs)

    service.connect()
    mockWs.triggerOpen()

    const closeSpy = vi.spyOn(mockWs, 'close')
    tokenProvider.setAccessToken('new-token')

    expect(closeSpy).toHaveBeenCalled()
  })
})
