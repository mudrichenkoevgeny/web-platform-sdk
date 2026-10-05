import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { UserSecurityRepository } from '@/repository/user/security/user-security-repository'
import { UserSecurityApi } from '@/network/api/user/security/user-security-api'
import { UserStorage } from '@/storage/user/user-storage'
import {
  toTotpRecoveryCodes,
  toTotpSetup
} from '@mudrichenkoevgeny/shared-foundation'
import type { TotpRecoveryCodes, TotpSetup } from "@mudrichenkoevgeny/shared-foundation";

/**
 * Implementation of {@link UserSecurityRepository} communicating with {@link UserSecurityApi}
 * and updating local TOTP status in {@link UserStorage}.
 */
export class UserSecurityRepositoryImpl implements UserSecurityRepository {
  /**
   * Constructs a new {@link UserSecurityRepositoryImpl}.
   *
   * @param userSecurityApi - Remote user security API
   * @param userStorage - Local user profile storage
   */
  public constructor(
    private readonly userSecurityApi: UserSecurityApi,
    private readonly userStorage: UserStorage
  ) {}

  /** Initiates TOTP setup process. */
  public async setupTotp(): Promise<AppResult<TotpSetup, AppError>> {
    const result = await this.userSecurityApi.setupTotp()
    return mapSuccess(result, (payload) => toTotpSetup(payload))
  }

  /** Finalizes and enables TOTP multifactor authentication using verification code. */
  public async enableTotp(mfaToken: string, code: string): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    const result = await this.userSecurityApi.enableTotp({
      mfa_token: mfaToken,
      totp_code: code
    })
    const mapped = mapSuccess(result, (payload) => toTotpRecoveryCodes(payload))

    if (isSuccess(mapped)) {
      await this.updateTotpStatusInStorage(true)
    }

    return mapped
  }

  /** Disables TOTP multifactor authentication. */
  public async disableTotp(): Promise<AppResult<void, AppError>> {
    const result = await this.userSecurityApi.disableTotp()

    if (isSuccess(result)) {
      await this.updateTotpStatusInStorage(false)
    }

    return result
  }

  /** Retrieves active backup recovery codes. */
  public async getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    const result = await this.userSecurityApi.getRecoveryCodes()
    return mapSuccess(result, (payload) => toTotpRecoveryCodes(payload))
  }

  /** Invalidates current recovery codes and generates fresh set. */
  public async regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    const result = await this.userSecurityApi.regenerateRecoveryCodes()
    return mapSuccess(result, (payload) => toTotpRecoveryCodes(payload))
  }

  private async updateTotpStatusInStorage(isEnabled: boolean): Promise<void> {
    const currentUser = await this.userStorage.getCurrentUser()
    if (currentUser) {
      await this.userStorage.updateCurrentUser({
        ...currentUser,
        isTotpEnabled: isEnabled
      })
    }
  }
}
