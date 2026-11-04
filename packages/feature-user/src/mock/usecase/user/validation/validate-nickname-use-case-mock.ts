import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ValidateNicknameUseCase } from '@/usecase/user/validation/validate-nickname-use-case'
import { GetAuthSettingsUseCaseMock } from '@/mock/usecase/auth/settings/get-auth-settings-use-case-mock'

/** Mock implementation of {@link ValidateNicknameUseCase}. */
export class ValidateNicknameUseCaseMock extends ValidateNicknameUseCase {
  public executeCalls = 0
  public lastNewNickname: string | null = null
  public lastCurrentNickname: string | null | undefined = undefined
  public resultProvider: (newNickname: string, currentNickname?: string | null) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public constructor() {
    super(new GetAuthSettingsUseCaseMock())
  }

  public override async execute(newNickname: string, currentNickname?: string | null): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    this.lastNewNickname = newNickname
    this.lastCurrentNickname = currentNickname
    return this.resultProvider(newNickname, currentNickname)
  }
}
