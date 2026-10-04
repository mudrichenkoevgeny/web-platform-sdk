import { AppError, AppResult, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SendResetPasswordConfirmationToEmailUseCase } from '@/usecase/auth/resetpassword/SendResetPasswordConfirmationToEmailUseCase'
import { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { ResetPasswordRepositoryMock } from '@/repository/auth/resetpassword/ResetPasswordRepositoryMock'

/**
 * Mock implementation of {@link SendResetPasswordConfirmationToEmailUseCase}.
 */
export class SendResetPasswordConfirmationToEmailUseCaseMock extends SendResetPasswordConfirmationToEmailUseCase {
  public resultProvider: (email: string) => Promise<AppResult<OtpConfirmation, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new ResetPasswordRepositoryMock())
  }

  public override async execute(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.resultProvider(email)
  }
}
