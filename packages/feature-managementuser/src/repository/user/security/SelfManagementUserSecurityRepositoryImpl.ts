import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { TotpRecoveryCodes, TotpSetup } from '@mudrichenkoevgeny/shared-foundation'
import { toTotpRecoveryCodes, toTotpSetup } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSecurityRepository, UserSecurityApi, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

class AsyncMutex {
  private queue: Promise<unknown> = Promise.resolve()

  public async runExclusive<T>(task: () => Promise<T>): Promise<T> {
    const res = this.queue.then(
      () => task(),
      () => task()
    )
    this.queue = res.catch(() => {})
    return res
  }
}

/**
 * Implements {@link UserSecurityRepository} using {@link UserSecurityApi} for the management context.
 */
export class SelfManagementUserSecurityRepositoryImpl implements UserSecurityRepository {
  private readonly mutex = new AsyncMutex()

  /**
   * Constructs a new {@link SelfManagementUserSecurityRepositoryImpl}.
   *
   * @param userSecurityApi - HTTP endpoints for user security operations
   * @param userStorage - Local storage for user details updates
   */
  public constructor(
    private readonly userSecurityApi: UserSecurityApi,
    private readonly userStorage: UserStorage
  ) {}

  public async setupTotp(): Promise<AppResult<TotpSetup, AppError>> {
    const result = await this.userSecurityApi.setupTotp()
    return mapSuccess(result, (payload) => toTotpSetup(payload))
  }

  public async enableTotp(mfaToken: string, code: string): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.userSecurityApi.enableTotp({
        mfa_token: mfaToken,
        totp_code: code
      })
      const mapped = mapSuccess(result, (payload) => toTotpRecoveryCodes(payload))
      if (isSuccess(mapped)) {
        await this.updateTotpStatusInStorage(true)
      }
      return mapped
    })
  }

  public async disableTotp(): Promise<AppResult<void, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.userSecurityApi.disableTotp()
      if (isSuccess(result)) {
        await this.updateTotpStatusInStorage(false)
      }
      return result
    })
  }

  public async getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    const result = await this.userSecurityApi.getRecoveryCodes()
    return mapSuccess(result, (payload) => toTotpRecoveryCodes(payload))
  }

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
