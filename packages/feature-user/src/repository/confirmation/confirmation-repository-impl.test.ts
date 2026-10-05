import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ConfirmationRepositoryImpl } from '@/repository/confirmation/ConfirmationRepositoryImpl'
import { ConfirmationType } from '@mudrichenkoevgeny/shared-foundation'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

describe('ConfirmationRepositoryImpl', () => {
  it('executes action when no cooldown is active', async () => {
    let now = 1000
    const repo = new ConfirmationRepositoryImpl(() => now)

    const action = vi.fn().mockResolvedValue(
      appResultSuccess<OtpConfirmation>({
        retryAfterSeconds: 60,
        numberOfSymbols: 6,
        expirationSeconds: 300
      })
    )

    const result = await repo.executeWithTimer(ConfirmationType.ADD_EMAIL, 'test@example.com', action)

    expect(isSuccess(result)).toBe(true)
    expect(action).toHaveBeenCalledOnce()
    expect(repo.getRemainingDelay(ConfirmationType.ADD_EMAIL, 'test@example.com')).toBe(60)
  })

  it('blocks execution when cooldown is active', async () => {
    let now = 1000
    const repo = new ConfirmationRepositoryImpl(() => now)

    const action = vi.fn().mockResolvedValue(
      appResultSuccess<OtpConfirmation>({
        retryAfterSeconds: 60,
        numberOfSymbols: 6,
        expirationSeconds: 300
      })
    )

    await repo.executeWithTimer(ConfirmationType.ADD_EMAIL, 'test@example.com', action)

    now += 10000 // 10 seconds later
    const secondAction = vi.fn()
    const secondResult = await repo.executeWithTimer(ConfirmationType.ADD_EMAIL, 'test@example.com', secondAction)

    expect(isSuccess(secondResult)).toBe(false)
    expect(secondAction).not.toHaveBeenCalled()
    expect(repo.getRemainingDelay(ConfirmationType.ADD_EMAIL, 'test@example.com')).toBe(50)
  })
})
