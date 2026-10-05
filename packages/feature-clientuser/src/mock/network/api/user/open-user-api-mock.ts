import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenUserApi } from '@/network/api/user/open-user-api'

/**
 * Mock implementation of {@link OpenUserApi}.
 */
export class OpenUserApiMock implements OpenUserApi {
  public getUserResult: AppResult<UserDetailsPayload, AppError> = appResultFailure(CommonError.unknown())
  public scheduleUserDeletionResult: AppResult<UserDetailsPayload, AppError> = appResultFailure(CommonError.unknown())
  public restoreUserResult: AppResult<UserDetailsPayload, AppError> = appResultFailure(CommonError.unknown())

  public async getUser(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return this.getUserResult
  }

  public async scheduleUserDeletion(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return this.scheduleUserDeletionResult
  }

  public async restoreUser(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return this.restoreUserResult
  }
}
