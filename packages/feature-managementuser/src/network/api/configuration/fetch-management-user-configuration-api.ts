import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementUserConfigurationRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserConfigurationApi } from '@/network/api/configuration/ManagementUserConfigurationApi'

/** {@link ManagementUserConfigurationApi} implementation backed by {@link HttpClient}. */
export class FetchManagementUserConfigurationApi implements ManagementUserConfigurationApi {
  /**
   * Constructs a new {@link FetchManagementUserConfigurationApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getManagementUserConfiguration(): Promise<AppResult<ManagementUserConfigurationPayload, AppError>> {
    return callResult(() =>
      this.client.request<ManagementUserConfigurationPayload>(ManagementUserConfigurationRoutes.GET_CONFIGURATION)
    )
  }
}
