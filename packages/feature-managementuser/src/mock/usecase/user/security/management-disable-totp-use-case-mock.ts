import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementDisableTotpUseCase } from '@/usecase/user/security/management-disable-totp-use-case'
import { ManagementUserSecurityRepositoryMock } from '@/mock/repository/user/security/management-user-security-repository-mock'

/** Mock implementation of {@link ManagementDisableTotpUseCase}. */
export class ManagementDisableTotpUseCaseMock extends ManagementDisableTotpUseCase {
  public resultProvider: (userId: UserId) => Promise<AppResult<void, AppError>> =
    async () => appResultSuccess(undefined)

  public constructor() {
    super(new ManagementUserSecurityRepositoryMock())
  }

  public override async execute(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.resultProvider(userId)
  }
}
