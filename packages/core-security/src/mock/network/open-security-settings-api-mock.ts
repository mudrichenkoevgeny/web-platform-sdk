import type { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { OpenSecuritySettingsApi } from '@/network/security-settings/open-security-settings-api'
import { openSecuritySettingsPayloadMock } from '@/mock/network/model/open-security-settings-payload-mock'
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
