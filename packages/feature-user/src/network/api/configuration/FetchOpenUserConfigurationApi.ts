import { AppError, AppResult, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserConfigurationApi } from './OpenUserConfigurationApi'

/** {@link OpenUserConfigurationApi} implementation backed by {@link HttpClient}. */
export class FetchOpenUserConfigurationApi implements OpenUserConfigurationApi {
  /**
   * Constructs a new {@link FetchOpenUserConfigurationApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Loads open user configuration via GET /global-settings or configuration route.
   *
   * @returns AppResult containing OpenUserConfigurationPayload or AppError
   */
  public async getOpenUserConfiguration(): Promise<AppResult<OpenUserConfigurationPayload, AppError>> {
    return callResult(() => this.client.request<OpenUserConfigurationPayload>('/configuration'))
  }
}
