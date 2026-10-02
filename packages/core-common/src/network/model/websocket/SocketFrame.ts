export interface SocketFrame {
  readonly id: string
  readonly type: string
  readonly payload?: unknown
  readonly metadata?: Record<string, string>
  readonly timestamp: number
}
