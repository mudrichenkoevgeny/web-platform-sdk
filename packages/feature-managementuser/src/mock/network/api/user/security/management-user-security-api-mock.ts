import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserSecurityApi } from '@/network/api/user/security/ManagementUserSecurityApi'

/** Mock implementation of {@link ManagementUserSecurityApi}. */
export class ManagementUserSecurityApiMock implements ManagementUserSecurityApi {
  public disableTotpResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public async disableTotp(_userId: UserId): Promise<AppResult<void, AppError>> {
    return this.disableTotpResult
  }
}
