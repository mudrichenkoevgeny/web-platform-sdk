import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUserApi } from '@/network/api/user/open-user-api'

/**
 * Mock implementation of {@link OpenUserApi}.
 */
export class OpenUserApiMock implements OpenUserApi {
  public getUserResult: AppResult<UserPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public scheduleUserDeletionResult: AppResult<UserPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public restoreUserResult: AppResult<UserPrivatePayload, AppError> = appResultFailure(CommonError.unknown())

  public async getUser(): Promise<AppResult<UserPrivatePayload, AppError>> {
    return this.getUserResult
  }

  public async scheduleUserDeletion(): Promise<AppResult<UserPrivatePayload, AppError>> {
    return this.scheduleUserDeletionResult
  }

  public async restoreUser(): Promise<AppResult<UserPrivatePayload, AppError>> {
    return this.restoreUserResult
  }
}
