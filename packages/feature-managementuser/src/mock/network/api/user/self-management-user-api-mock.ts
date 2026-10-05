import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementUserApi } from '@/network/api/user/SelfManagementUserApi'

/** Mock implementation of {@link SelfManagementUserApi}. */
export class SelfManagementUserApiMock implements SelfManagementUserApi {
  public userResult: AppResult<UserDetailsPayload, AppError> = appResultFailure(CommonError.unknown())

  public async getUser(): Promise<AppResult<UserDetailsPayload, AppError>> {
    return this.userResult
  }
}
