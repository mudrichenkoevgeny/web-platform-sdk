import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementAuthSettingsPayload, createTestOpenAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsPayload, OpenAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsApi } from '@/network/api/auth/settings/management-auth-settings-api'

/** Mock implementation of {@link ManagementAuthSettingsApi}. */
export class ManagementAuthSettingsApiMock implements ManagementAuthSettingsApi {
  public lastRequest: ManagementAuthSettingsPayload | null = null
  public getCallCount = 0
  public updateCallCount = 0
  public resetCallCount = 0

  public openResultProvider: () => Promise<AppResult<OpenAuthSettingsPayload, AppError>> = async () =>
    appResultSuccess(createTestOpenAuthSettingsPayload())

  public getResultProvider: () => Promise<AppResult<ManagementAuthSettingsPayload, AppError>> = async () =>
    appResultFailure(CommonError.unknown(false))

  public updateResultProvider: () => Promise<AppResult<ManagementAuthSettingsPayload, AppError>> = async () =>
    appResultSuccess(createTestManagementAuthSettingsPayload())

  public resetResultProvider: () => Promise<AppResult<ManagementAuthSettingsPayload, AppError>> = async () =>
    this.getResultProvider()

  public get getManagementAuthSettingsResult() {
    return this.getResultProvider()
  }
  public set getManagementAuthSettingsResult(val: Promise<AppResult<ManagementAuthSettingsPayload, AppError>> | AppResult<ManagementAuthSettingsPayload, AppError>) {
    this.getResultProvider = async () => (val instanceof Promise ? val : val)
  }

  public get updateManagementAuthSettingsResult() {
    return this.updateResultProvider()
  }
  public set updateManagementAuthSettingsResult(val: Promise<AppResult<ManagementAuthSettingsPayload, AppError>> | AppResult<ManagementAuthSettingsPayload, AppError>) {
    this.updateResultProvider = async () => (val instanceof Promise ? val : val)
  }

  public get resetManagementAuthSettingsResult() {
    return this.resetResultProvider()
  }
  public set resetManagementAuthSettingsResult(val: Promise<AppResult<ManagementAuthSettingsPayload, AppError>> | AppResult<ManagementAuthSettingsPayload, AppError>) {
    this.resetResultProvider = async () => (val instanceof Promise ? val : val)
  }

  public async getAuthSettings(): Promise<AppResult<OpenAuthSettingsPayload, AppError>> {
    return this.openResultProvider()
  }

  public async getManagementAuthSettings(): Promise<AppResult<ManagementAuthSettingsPayload, AppError>> {
    this.getCallCount++
    return this.getResultProvider()
  }

  public async updateManagementAuthSettings(
    request: ManagementAuthSettingsPayload
  ): Promise<AppResult<ManagementAuthSettingsPayload, AppError>> {
    this.updateCallCount++
    this.lastRequest = request
    return this.updateResultProvider()
  }

  public async resetManagementAuthSettings(): Promise<AppResult<ManagementAuthSettingsPayload, AppError>> {
    this.resetCallCount++
    return this.resetResultProvider()
  }
}
