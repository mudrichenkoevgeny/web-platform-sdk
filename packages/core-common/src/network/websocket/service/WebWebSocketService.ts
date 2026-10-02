import { AccessTokenProvider } from '../../provider/AccessTokenProvider'
import { DeviceInfoProvider } from '../../../platform/deviceinfo/DeviceInfoProvider'
import { SocketFrame } from '../../model/websocket/SocketFrame'
import { WebSocketMessageHandler } from '../messagehandler/WebSocketMessageHandler'
import { WebSocketService, SocketEventListener } from './WebSocketService'
import { CommonWebSocketEventTypes } from '../../contract/CommonWebSocketEventTypes'
import { generateErrorId } from '../../../error/model/ErrorId'

const INITIAL_RECONNECT_DELAY_MS = 2000
const MAX_RECONNECT_DELAY_MS = 60000
const MIN_SESSION_DURATION_MS = 5000
const LOGGER_SOCKET_PREFIX = 'Socket'

export interface WebWebSocketServiceConfig {
  baseUrl: string
  webSocketPath: string
  accessTokenProvider: AccessTokenProvider
  deviceInfoProvider: DeviceInfoProvider
  logger?: (msg: string) => void
  webSocketFactory?: (url: string) => WebSocket
}

export class WebWebSocketService implements WebSocketService {
  private readonly baseUrl: string
  private readonly webSocketPath: string
  private readonly accessTokenProvider: AccessTokenProvider
  private readonly deviceInfoProvider: DeviceInfoProvider
  private readonly logger?: (msg: string) => void
  private readonly webSocketFactory: (url: string) => WebSocket

  private isConnectionStarted = false
  private currentSocket: WebSocket | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private currentDelay = INITIAL_RECONNECT_DELAY_MS
  private connectedAt = 0

  private webSocketMessageHandlers: WebSocketMessageHandler[] = []
  private readonly eventListeners = new Set<SocketEventListener>()
  private readonly outgoingQueue: SocketFrame[] = []

  private previousToken: string | null = null
  private tokenUnsubscribe: (() => void) | null = null

  public constructor(config: WebWebSocketServiceConfig) {
    this.baseUrl = config.baseUrl
    this.webSocketPath = config.webSocketPath
    this.accessTokenProvider = config.accessTokenProvider
    this.deviceInfoProvider = config.deviceInfoProvider
    this.logger = config.logger
    this.webSocketFactory =
      config.webSocketFactory ??
      ((url: string) => new WebSocket(url))

    this.observeTokenChanges()
  }

  public connect(): void {
    if (this.isConnectionStarted) {
      this.logger?.(`${LOGGER_SOCKET_PREFIX}: Already started`)
      return
    }

    this.logger?.(`${LOGGER_SOCKET_PREFIX}: Connecting...`)
    this.isConnectionStarted = true
    this.startConnection()
  }

  public disconnect(): void {
    this.logger?.(`${LOGGER_SOCKET_PREFIX}: Disconnecting...`)
    this.isConnectionStarted = false
    this.clearReconnectTimer()

    if (this.tokenUnsubscribe) {
      this.tokenUnsubscribe()
      this.tokenUnsubscribe = null
    }

    if (this.currentSocket) {
      this.currentSocket.close()
      this.currentSocket = null
    }
  }

  public restart(): void {
    if (!this.isConnectionStarted) {
      this.logger?.(`${LOGGER_SOCKET_PREFIX}: Cannot restart, service not started`)
      return
    }

    this.logger?.(`${LOGGER_SOCKET_PREFIX}: Restarting connection...`)
    this.clearReconnectTimer()

    if (this.currentSocket) {
      this.currentSocket.close()
      this.currentSocket = null
    }

    this.startConnection()
  }

  public observeEvents(listener: SocketEventListener): () => void {
    this.eventListeners.add(listener)
    return () => {
      this.eventListeners.delete(listener)
    }
  }

  public updateWebSocketMessageHandlers(handlers: WebSocketMessageHandler[]): void {
    this.webSocketMessageHandlers = handlers
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

    if (this.currentSocket && this.currentSocket.readyState === WebSocket.OPEN) {
      this.currentSocket.send(JSON.stringify(frame))
    } else {
      this.outgoingQueue.push(frame)
    }
  }

  public async sendPing(metadata?: Record<string, string>): Promise<void> {
    await this.sendEvent(CommonWebSocketEventTypes.PING, null, metadata)
  }

  private startConnection(): void {
    this.clearReconnectTimer()

    const token = this.accessTokenProvider.getAccessToken()
    const fullPath = token ? `${this.webSocketPath}?token=${encodeURIComponent(token)}` : this.webSocketPath
    const wsUrl = this.buildWebSocketUrl(this.baseUrl, fullPath)

    try {
      this.connectedAt = Date.now()
      const socket = this.webSocketFactory(wsUrl)
      this.currentSocket = socket

      socket.onopen = () => {
        this.logger?.(`${LOGGER_SOCKET_PREFIX}: Connected to ${wsUrl}`)
        void this.sendInitializeFrame()
        this.flushOutgoingQueue()
      }

      socket.onmessage = (event) => {
        try {
          const frame = JSON.parse(event.data) as SocketFrame
          void this.processIncomingFrame(frame)
        } catch {
          this.logger?.(`${LOGGER_SOCKET_PREFIX}: Failed to parse frame: ${event.data}`)
        }
      }

      socket.onclose = () => {
        this.handleSocketClosed()
      }

      socket.onerror = (error) => {
        this.logger?.(`${LOGGER_SOCKET_PREFIX}: Connection error: ${String(error)}`)
      }
    } catch (e) {
      this.logger?.(`${LOGGER_SOCKET_PREFIX}: Connection setup error: ${String(e)}`)
      this.scheduleReconnect()
    }
  }

  private handleSocketClosed(): void {
    this.currentSocket = null
    const sessionDuration = Date.now() - this.connectedAt

    if (sessionDuration >= MIN_SESSION_DURATION_MS) {
      this.currentDelay = INITIAL_RECONNECT_DELAY_MS
    }

    if (this.isConnectionStarted) {
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect(): void {
    if (!this.isConnectionStarted || this.reconnectTimer) {
      return
    }

    this.logger?.(`${LOGGER_SOCKET_PREFIX}: Next retry in ${this.currentDelay} ms`)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      if (this.isConnectionStarted) {
        this.startConnection()
      }
    }, this.currentDelay)

    this.currentDelay = Math.min(this.currentDelay * 2, MAX_RECONNECT_DELAY_MS)
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private async processIncomingFrame(frame: SocketFrame): Promise<void> {
    let isHandled = false

    for (const handler of this.webSocketMessageHandlers) {
      const result = await handler.handle(frame)
      if (result.kind !== 'NotHandled') {
        isHandled = true
        if (result.kind === 'SendSocketFrame') {
          await this.sendEvent(
            result.socketFrame.type,
            result.socketFrame.payload,
            result.socketFrame.metadata
          )
        } else if (result.kind === 'Error') {
          this.logger?.(`${LOGGER_SOCKET_PREFIX}: Handler error: ${result.appError.code}`)
        }
        break
      }
    }

    if (!isHandled) {
      for (const listener of this.eventListeners) {
        listener(frame)
      }
    }
  }

  private async sendInitializeFrame(): Promise<void> {
    const deviceInfo = await this.deviceInfoProvider.getDeviceInfo()
    await this.sendEvent(CommonWebSocketEventTypes.INITIALIZE, deviceInfo)
  }

  private flushOutgoingQueue(): void {
    if (!this.currentSocket || this.currentSocket.readyState !== WebSocket.OPEN) {
      return
    }

    while (this.outgoingQueue.length > 0) {
      const frame = this.outgoingQueue.shift()
      if (frame) {
        this.currentSocket.send(JSON.stringify(frame))
      }
    }
  }

  private observeTokenChanges(): void {
    this.previousToken = this.accessTokenProvider.getAccessToken()
    this.tokenUnsubscribe = this.accessTokenProvider.observeAccessToken((newToken) => {
      if (this.isConnectionStarted && newToken !== this.previousToken) {
        this.previousToken = newToken
        this.logger?.(`${LOGGER_SOCKET_PREFIX}: Token updated, restarting...`)
        this.restart()
      } else {
        this.previousToken = newToken
      }
    })
  }

  private buildWebSocketUrl(baseUrl: string, path: string): string {
    let normalized = baseUrl
      .replace(/^https:\/\//i, 'wss://')
      .replace(/^http:\/\//i, 'ws://')

    if (!normalized.startsWith('ws://') && !normalized.startsWith('wss://')) {
      normalized = `wss://${normalized}`
    }

    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1)
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${normalized}${normalizedPath}`
  }
}
