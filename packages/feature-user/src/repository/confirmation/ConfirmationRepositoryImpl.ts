import { appResultFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ConfirmationRepository } from '@/repository/confirmation/ConfirmationRepository'
import type { ConfirmationType } from '@mudrichenkoevgeny/shared-foundation'
import { UserError } from '@/error/model/UserError'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
/**
 * In-memory implementation of {@link ConfirmationRepository} that records block-until timestamps.
 */
export class ConfirmationRepositoryImpl implements ConfirmationRepository {
  private readonly blockedUntilMap = new Map<string, number>()

  /**
   * Constructs a new {@link ConfirmationRepositoryImpl}.
   *
   * @param clock - Function returning current timestamp in milliseconds
   */
  public constructor(private readonly clock: () => number = () => Date.now()) {}

  /**
   * Invokes action when cooldown for given key has elapsed; otherwise returns error AppResult.
   */
  public async executeWithTimer<T>(
    type: ConfirmationType,
    identifier: string,
    action: () => Promise<AppResult<T, AppError>>
  ): Promise<AppResult<T, AppError>> {
    const remaining = this.getRemainingDelay(type, identifier)

    if (remaining > 0) {
      return appResultFailure(UserError.tooManyConfirmationRequests(remaining))
    }

    const result = await action()

    if (isSuccess(result)) {
      const data = result.data as unknown as OtpConfirmation | null
      if (data && typeof data.retryAfterSeconds === 'number' && data.retryAfterSeconds > 0) {
        const key = `${type}:${identifier}`
        const now = this.clock()
        this.blockedUntilMap.set(key, now + data.retryAfterSeconds * 1000)
      }
    }

    return result
  }

  /**
   * Returns remaining cooldown in seconds before another attempt is allowed, or 0.
   */
  public getRemainingDelay(type: ConfirmationType, identifier: string): number {
    const key = `${type}:${identifier}`
    const blockedUntil = this.blockedUntilMap.get(key)
    if (!blockedUntil) {
      return 0
    }

    const now = this.clock()
    const diff = blockedUntil - now
    return diff > 0 ? Math.floor(diff / 1000) : 0
  }
}
