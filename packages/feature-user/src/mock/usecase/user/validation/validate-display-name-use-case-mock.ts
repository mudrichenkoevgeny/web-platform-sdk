import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ValidateDisplayNameUseCase } from '@/usecase/user/validation/validate-display-name-use-case'
import { GetAuthSettingsUseCaseMock } from '@/mock/usecase/auth/settings/get-auth-settings-use-case-mock'

/** Mock implementation of {@link ValidateDisplayNameUseCase}. */
export class ValidateDisplayNameUseCaseMock extends ValidateDisplayNameUseCase {
  public executeCalls = 0
  public lastNewDisplayName: string | null = null
  public resultProvider: (newDisplayName: string) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public constructor() {
    super(new GetAuthSettingsUseCaseMock())
  }

  public override async execute(newDisplayName: string): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    this.lastNewDisplayName = newDisplayName
    return this.resultProvider(newDisplayName)
  }
}
