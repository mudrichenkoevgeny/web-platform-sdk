import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsApi } from '@/network/api/auth/settings/management-auth-settings-api'

/** Mock implementation of {@link ManagementAuthSettingsApi}. */
export class ManagementAuthSettingsApiMock implements ManagementAuthSettingsApi {
  public lastRequest: ManagementAuthSettingsPayload | null = null
  public getCallCount = 0
  public updateCallCount = 0
  public resetCallCount = 0

  public getResultProvider: () => Promise<AppResult<ManagementAuthSettingsPayload, AppError>> = async () =>
    appResultFailure(CommonError.unknown(false))

  public updateResultProvider: () => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public resetResultProvider: () => Promise<AppResult<ManagementAuthSettingsPayload, AppError>> = async () =>
    this.getResultProvider()

  public async getManagementAuthSettings(): Promise<AppResult<ManagementAuthSettingsPayload, AppError>> {
    this.getCallCount++
    return this.getResultProvider()
  }

  public async updateManagementAuthSettings(
    request: ManagementAuthSettingsPayload
  ): Promise<AppResult<void, AppError>> {
    this.updateCallCount++
    this.lastRequest = request
    return this.updateResultProvider()
  }

  public async resetManagementAuthSettings(): Promise<AppResult<ManagementAuthSettingsPayload, AppError>> {
    this.resetCallCount++
    return this.resetResultProvider()
  }
}
