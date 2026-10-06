import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { RefreshOpenSecuritySettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { RefreshOpenGlobalSettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { RefreshOpenAuthSettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'

/**
 * Runs global, security, and auth settings refresh use cases concurrently and logs failures without throwing.
 */
export class SyncDataUseCase {
  public constructor(
    private readonly refreshOpenGlobalSettingsUseCase: RefreshOpenGlobalSettingsUseCase,
    private readonly refreshOpenSecuritySettingsUseCase: RefreshOpenSecuritySettingsUseCase,
    private readonly refreshOpenAuthSettingsUseCase: RefreshOpenAuthSettingsUseCase
  ) {}

  /**
   * Awaits all three refresh jobs concurrently; errors are logged and swallowed.
   */
  public async invoke(): Promise<void> {
    const logIfError = <T>(result: AppResult<T>, tag: string): AppResult<T> => {
      if (!isSuccess(result)) {
        console.error(`Failed to sync ${tag}:`, result.error)
      }
      return result
    }

    await Promise.all([
      this.refreshOpenGlobalSettingsUseCase.execute().then((res) => logIfError(res, 'GlobalSettings')),
      this.refreshOpenSecuritySettingsUseCase.execute().then((res) => logIfError(res, 'SecuritySettings')),
      this.refreshOpenAuthSettingsUseCase.execute().then((res) => logIfError(res, 'AuthSettings'))
    ])
  }
}
