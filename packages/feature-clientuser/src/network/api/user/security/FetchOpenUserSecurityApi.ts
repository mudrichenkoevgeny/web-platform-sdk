import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  TotpRecoveryCodesPayload,
  TotpSetupPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserSecurityRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Open {@link UserSecurityApi} implementation backed by {@link HttpClient}. */
export class FetchOpenUserSecurityApi implements UserSecurityApi {
  /**
   * Constructs a new {@link FetchOpenUserSecurityApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async setupTotp(): Promise<AppResult<TotpSetupPayload, AppError>> {
    return callResult(() =>
      this.client.request<TotpSetupPayload>(OpenUserSecurityRoutes.SETUP_TOTP, {
        method: 'POST'
      })
    )
  }

  public async enableTotp(request: VerifyTotpPayload): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return callResult(() =>
      this.client.request<TotpRecoveryCodesPayload>(OpenUserSecurityRoutes.ENABLE_TOTP, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async disableTotp(): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenUserSecurityRoutes.DISABLE_TOTP, {
        method: 'DELETE'
      })
    )
  }

  public async getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return callResult(() =>
      this.client.request<TotpRecoveryCodesPayload>(OpenUserSecurityRoutes.GET_RECOVERY_CODES)
    )
  }

  public async regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return callResult(() =>
      this.client.request<TotpRecoveryCodesPayload>(OpenUserSecurityRoutes.REGENERATE_RECOVERY_CODES, {
        method: 'POST'
      })
    )
  }
}
