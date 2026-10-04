import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ConfirmationRepository } from '@/repository/confirmation/ConfirmationRepository'
import { ConfirmationType } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Mock implementation of {@link ConfirmationRepository}.
 */
export class ConfirmationRepositoryMock implements ConfirmationRepository {
  public executeWithTimerResult: AppResult<unknown, AppError> | null = null
  public delayReturn = 0
  public lastType: ConfirmationType | null = null
  public lastIdentifier: string | null = null

  public async executeWithTimer<T>(
    type: ConfirmationType,
    identifier: string,
    action: () => Promise<AppResult<T, AppError>>
  ): Promise<AppResult<T, AppError>> {
    this.lastType = type
    this.lastIdentifier = identifier

    if (this.executeWithTimerResult) {
      return this.executeWithTimerResult as AppResult<T, AppError>
    }
    return action()
  }

  public getRemainingDelay(type: ConfirmationType, identifier: string): number {
    this.lastType = type
    this.lastIdentifier = identifier
    return this.delayReturn
  }
}
