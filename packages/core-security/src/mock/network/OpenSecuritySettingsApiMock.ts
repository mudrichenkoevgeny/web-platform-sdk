import { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { AppResult, AppError, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenSecuritySettingsApi } from '../../network/securitysettings/OpenSecuritySettingsApi'
import { openSecuritySettingsPayloadMock } from './model/OpenSecuritySettingsPayloadMock'

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
  public async getSecuritySettings(): Promise<AppResult<OpenSecuritySettingsPayload, AppError>> {
    this.getSecuritySettingsCallCount++

    if (this.shouldFail) {
      return { success: false, error: CommonError.unknown() }
    }

    const payload = this.mockPayload ?? openSecuritySettingsPayloadMock()
    return { success: true, data: payload }
  }
}
