import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  RefreshManagementAuthSettingsUseCase,
  RefreshManagementGlobalSettingsUseCase,
  RefreshManagementSecuritySettingsUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

/**
 * Runs global, security, and auth settings refresh use cases concurrently for management app and logs failures without throwing.
 */
export class SyncManagementDataUseCase {
  public constructor(
    private readonly refreshManagementGlobalSettingsUseCase: RefreshManagementGlobalSettingsUseCase,
    private readonly refreshManagementSecuritySettingsUseCase: RefreshManagementSecuritySettingsUseCase,
    private readonly refreshManagementAuthSettingsUseCase: RefreshManagementAuthSettingsUseCase
  ) {}

  /**
   * Awaits all three refresh jobs concurrently; errors are logged and swallowed.
   */
  public async invoke(): Promise<void> {
    const logIfError = <T>(result: AppResult<T, AppError>, tag: string): AppResult<T, AppError> => {
      if (!isSuccess(result)) {
        console.error(`Failed to sync ${tag}:`, result.error)
      }
      return result
    }

    await Promise.all([
      this.refreshManagementGlobalSettingsUseCase.execute().then((res) => logIfError(res, 'GlobalSettings')),
      this.refreshManagementSecuritySettingsUseCase.execute().then((res) => logIfError(res, 'SecuritySettings')),
      this.refreshManagementAuthSettingsUseCase.execute().then((res) => logIfError(res, 'AuthSettings'))
    ])
  }
}
