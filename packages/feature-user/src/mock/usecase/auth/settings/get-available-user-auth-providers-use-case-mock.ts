import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { AvailableAuthProviders } from '@mudrichenkoevgeny/shared-foundation'
import { GetAvailableUserAuthProvidersUseCase } from '@/usecase/auth/settings/get-available-user-auth-providers-use-case'
import { OpenAuthSettingsRepositoryMock } from '@/mock/repository/auth/settings/open-auth-settings-repository-mock'

/** Mock implementation of {@link GetAvailableUserAuthProvidersUseCase}. */
export class GetAvailableUserAuthProvidersUseCaseMock extends GetAvailableUserAuthProvidersUseCase {
  public resultProvider: () => Promise<AppResult<AvailableAuthProviders, AppError>> = async () =>
    appResultSuccess({
      primary: [UserAuthProvider.EMAIL],
      secondary: [UserAuthProvider.GOOGLE]
    })

  public constructor() {
    super(AppType.CLIENT, new OpenAuthSettingsRepositoryMock())
  }

  public override async execute(): Promise<AppResult<AvailableAuthProviders, AppError>> {
    return this.resultProvider()
  }
}
