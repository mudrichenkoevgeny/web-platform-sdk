import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { GetAuthSettingsUseCase } from '@/usecase/auth/settings/get-auth-settings-use-case'
import { OpenAuthSettingsRepositoryMock } from '@/mock/repository/auth/settings/open-auth-settings-repository-mock'

/** Mock implementation of {@link GetAuthSettingsUseCase}. */
export class GetAuthSettingsUseCaseMock extends GetAuthSettingsUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<OpenAuthSettings, AppError>> = async () =>
    appResultFailure(CommonError.unknown())

  public constructor() {
    super(new OpenAuthSettingsRepositoryMock())
  }

  public override async execute(): Promise<AppResult<OpenAuthSettings, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
