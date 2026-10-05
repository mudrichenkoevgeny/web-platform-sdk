import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenAuthSettingsApi } from '@/network/api/auth/settings/open-auth-settings-api'

/**
 * Mock implementation of {@link OpenAuthSettingsApi}.
 */
export class OpenAuthSettingsApiMock implements OpenAuthSettingsApi {
  public result: AppResult<OpenAuthSettingsPayload, AppError> = appResultFailure(
    CommonError.unknown(false)
  )
  public callCount = 0

  public async getAuthSettings(): Promise<AppResult<OpenAuthSettingsPayload, AppError>> {
    this.callCount++
    return this.result
  }
}
