import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementUserConfigurationRoutes, managementUserConfigurationPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserConfigurationApi } from '@/network/api/configuration/management-user-configuration-api'

/** {@link ManagementUserConfigurationApi} implementation backed by {@link HttpClient}. */
export class FetchManagementUserConfigurationApi implements ManagementUserConfigurationApi {
  /**
   * Constructs a new {@link FetchManagementUserConfigurationApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getManagementUserConfiguration(): Promise<AppResult<ManagementUserConfigurationPayload, AppError>> {
    return callResult(async () => {
      const response = await this.client.request<unknown>(
        ManagementUserConfigurationRoutes.GET_MANAGEMENT_USER_CONFIGURATION
      )
      return managementUserConfigurationPayloadSchema.parse(response)
    })
  }
}
