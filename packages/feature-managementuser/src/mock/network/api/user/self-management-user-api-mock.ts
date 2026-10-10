import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'

/** Mock implementation of {@link SelfManagementUserApi}. */
export class SelfManagementUserApiMock implements SelfManagementUserApi {
  public userResult: AppResult<UserPrivatePayload, AppError> = appResultFailure(CommonError.unknown())

  public async getUser(): Promise<AppResult<UserPrivatePayload, AppError>> {
    return this.userResult
  }
}
