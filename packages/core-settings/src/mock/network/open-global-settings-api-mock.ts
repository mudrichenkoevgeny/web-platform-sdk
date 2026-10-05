import type { OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { OpenGlobalSettingsApi } from '@/network/global-settings/open-global-settings-api'
import { openGlobalSettingsPayloadMock } from '@/mock/network/model/open-global-settings-payload-mock'
/**
 * Mock implementation of {@link OpenGlobalSettingsApi}.
 */
export class OpenGlobalSettingsApiMock implements OpenGlobalSettingsApi {
  public getOpenGlobalSettingsCallCount = 0

  /**
   * Constructs a new {@link OpenGlobalSettingsApiMock}.
   *
   * @param mockPayload - Initial mock payload to return
   * @param shouldFail - Whether requests should return an error
   */
  public constructor(
    private readonly mockPayload?: OpenGlobalSettingsPayload,
    private readonly shouldFail: boolean = false
  ) {}

  /**
   * Simulates fetching open global settings.
   *
   * @returns Configured mock result or error
   */
  public async getOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettingsPayload, AppError>> {
    this.getOpenGlobalSettingsCallCount++

    if (this.shouldFail) {
      return { success: false, error: CommonError.unknown() }
    }

    const payload = this.mockPayload ?? openGlobalSettingsPayloadMock()
    return { success: true, data: payload }
  }
}
