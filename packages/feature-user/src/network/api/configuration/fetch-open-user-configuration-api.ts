import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserConfigurationRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUserConfigurationApi } from '@/network/api/configuration/open-user-configuration-api'

/** {@link OpenUserConfigurationApi} implementation backed by {@link HttpClient}. */
export class FetchOpenUserConfigurationApi implements OpenUserConfigurationApi {
  /**
   * Constructs a new {@link FetchOpenUserConfigurationApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Loads open user configuration via open user configuration route.
   *
   * @returns AppResult containing OpenUserConfigurationPayload or AppError
   */
  public async getOpenUserConfiguration(): Promise<AppResult<OpenUserConfigurationPayload, AppError>> {
    const route = OpenUserConfigurationRoutes.GET_CONFIGURATION.startsWith('/')
      ? OpenUserConfigurationRoutes.GET_CONFIGURATION
      : `/${OpenUserConfigurationRoutes.GET_CONFIGURATION}`
    return callResult(() => this.client.request<OpenUserConfigurationPayload>(route))
  }
}
