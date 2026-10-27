import type { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createTestOpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenSecuritySettingsApi } from '@/network/api/security-settings/open-security-settings-api'

/**
 * Mock implementation of {@link OpenSecuritySettingsApi}.
 */
export class OpenSecuritySettingsApiMock implements OpenSecuritySettingsApi {
  public getSecuritySettingsCallCount = 0

  /**
   * Constructs a new {@link OpenSecuritySettingsApiMock}.
   *
   * @param mockPayload - Initial mock payload to return
   * @param shouldFail - Whether requests should return an error
   */
  public constructor(
    private readonly mockPayload?: OpenSecuritySettingsPayload,
    private readonly shouldFail: boolean = false
  ) {}

  /**
   * Simulates fetching open security settings.
   *
   * @returns Configured mock result or error
   */
  public async getOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettingsPayload, AppError>> {
    this.getSecuritySettingsCallCount++

    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }

    const payload = this.mockPayload ?? createTestOpenSecuritySettingsPayload()
    return appResultSuccess(payload)
  }
}
