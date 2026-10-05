import { describe, it, expect } from 'vitest'
import { CommonHttpHeaders } from '@/network/contract/common-http-headers'
import { CommonWebSocketEventTypes } from '@/network/contract/common-web-socket-event-types'

describe('Contract Constants', () => {
  it('validates header names', () => {
    expect(CommonHttpHeaders.TRACE_HEADER_NAME).toBe('X-Trace-Id')
    expect(CommonHttpHeaders.CLIENT_TYPE_HEADER_NAME).toBe('X-Client-Type')
    expect(CommonHttpHeaders.DEVICE_ID_HEADER_NAME).toBe('X-Device-Id')
  })

  it('validates websocket event types', () => {
    expect(CommonWebSocketEventTypes.PING).toBe('PING')
    expect(CommonWebSocketEventTypes.PONG).toBe('PONG')
    expect(CommonWebSocketEventTypes.INITIALIZE).toBe('INITIALIZE')
    expect(CommonWebSocketEventTypes.INITIALIZED_SUCCESS).toBe('INITIALIZED_SUCCESS')
  })
})
