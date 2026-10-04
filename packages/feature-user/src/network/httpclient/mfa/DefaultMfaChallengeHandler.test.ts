import { describe, it, expect, vi } from 'vitest'
import { DefaultMfaChallengeHandler } from './DefaultMfaChallengeHandler'

describe('DefaultMfaChallengeHandler', () => {
  it('requests code and resolves on confirm', async () => {
    const handler = new DefaultMfaChallengeHandler()
    const listener = vi.fn()

    handler.subscribe(listener)
    expect(listener).toHaveBeenCalledWith(null)

    const codePromise = handler.onRequestMfaCode('token-abc')

    expect(handler.getChallengeRequest()).not.toBeNull()
    expect(handler.getChallengeRequest()?.mfaToken).toBe('token-abc')

    handler.onConfirm('123456')

    const result = await codePromise
    expect(result).toBe('123456')
    expect(handler.getChallengeRequest()).toBeNull()
  })

  it('resolves with null on cancel', async () => {
    const handler = new DefaultMfaChallengeHandler()
    const codePromise = handler.onRequestMfaCode('token-xyz')

    handler.onCancel()

    const result = await codePromise
    expect(result).toBeNull()
    expect(handler.getChallengeRequest()).toBeNull()
  })
})
