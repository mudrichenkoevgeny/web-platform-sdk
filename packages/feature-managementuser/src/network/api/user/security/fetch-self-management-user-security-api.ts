import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  TotpRecoveryCodesPayload,
  TotpSetupPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUserSecurityRoutes } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSecurityApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Self-management {@link UserSecurityApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementUserSecurityApi implements UserSecurityApi {
  /**
   * Constructs a new {@link FetchSelfManagementUserSecurityApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async setupTotp(): Promise<AppResult<TotpSetupPayload, AppError>> {
    return callResult(() =>
      this.client.request<TotpSetupPayload>(SelfManagementUserSecurityRoutes.SETUP_TOTP, {
        method: 'POST'
      })
    )
  }

  public async enableTotp(request: VerifyTotpPayload): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return callResult(() =>
      this.client.request<TotpRecoveryCodesPayload>(SelfManagementUserSecurityRoutes.ENABLE_TOTP, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }

  public async disableTotp(): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(SelfManagementUserSecurityRoutes.DISABLE_TOTP, {
        method: 'DELETE'
      })
    )
  }

  public async getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return callResult(() =>
      this.client.request<TotpRecoveryCodesPayload>(SelfManagementUserSecurityRoutes.GET_RECOVERY_CODES)
    )
  }

  public async regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return callResult(() =>
      this.client.request<TotpRecoveryCodesPayload>(SelfManagementUserSecurityRoutes.REGENERATE_RECOVERY_CODES, {
        method: 'POST'
      })
    )
  }
}
