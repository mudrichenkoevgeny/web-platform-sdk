import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RefreshTokenUseCase } from '@/usecase/auth/refresh-token/refresh-token-use-case'
import { RefreshTokenRepositoryMock } from '@/mock/repository/auth/refresh-token/refresh-token-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'

/** Mock implementation of {@link RefreshTokenUseCase}. */
export class RefreshTokenUseCaseMock extends RefreshTokenUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<any, AppError>> = async () => appResultSuccess(undefined)

  public constructor() {
    super(new RefreshTokenRepositoryMock(), new AuthStorageMock())
  }

  public override async execute(): Promise<AppResult<any, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
