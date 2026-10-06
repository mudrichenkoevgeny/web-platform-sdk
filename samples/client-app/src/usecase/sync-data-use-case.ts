import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { RefreshClientUserConfigurationUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'

/**
 * Runs user configuration refresh use case and logs failures without throwing.
 */
export class SyncDataUseCase {
  public constructor(
    private readonly refreshUserConfigurationUseCase: RefreshClientUserConfigurationUseCase
  ) {}

  /**
   * Executes configuration refresh flow; errors are logged and swallowed.
   */
  public async invoke(): Promise<void> {
    const result = await this.refreshUserConfigurationUseCase.execute()
    if (!isSuccess(result)) {
      console.error('Failed to sync user configuration:', result.error)
    }
  }
}
