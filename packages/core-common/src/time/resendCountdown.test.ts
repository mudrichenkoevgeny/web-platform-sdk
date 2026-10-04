import { describe, it, expect, vi } from 'vitest'
import { resendCountdown } from '@/time/resendCountdown'

describe('resendCountdown', () => {
  it('counts down from totalSeconds to 0', async () => {
    vi.useFakeTimers()
    const onTick = vi.fn()

    const promise = resendCountdown(3, onTick, 1000)

    await vi.advanceTimersByTimeAsync(1000)
    expect(onTick).toHaveBeenNthCalledWith(1, 2)

    await vi.advanceTimersByTimeAsync(1000)
    expect(onTick).toHaveBeenNthCalledWith(2, 1)

    await vi.advanceTimersByTimeAsync(1000)
    expect(onTick).toHaveBeenNthCalledWith(3, 0)

    await promise
    vi.useRealTimers()
  })

  it('stops countdown if abortSignal is aborted', async () => {
    vi.useFakeTimers()
    const onTick = vi.fn()
    const controller = new AbortController()

    const promise = resendCountdown(5, onTick, 1000, controller.signal)

    await vi.advanceTimersByTimeAsync(1000)
    expect(onTick).toHaveBeenCalledWith(4)

    controller.abort()
    await vi.advanceTimersByTimeAsync(2000)
    expect(onTick).toHaveBeenCalledTimes(1)

    await promise
    vi.useRealTimers()
  })
})
