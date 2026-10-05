import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { SendLoginConfirmationToPhoneUseCase } from '@/usecase/auth/login/send-login-confirmation-to-phone-use-case'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { LoginRepositoryMock } from '@/mock/repository/auth/login/login-repository-mock'
/**
 * Mock implementation of {@link SendLoginConfirmationToPhoneUseCase}.
 */
export class SendLoginConfirmationToPhoneUseCaseMock extends SendLoginConfirmationToPhoneUseCase {
  public resultProvider: (phoneNumber: string) => Promise<AppResult<OtpConfirmation, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new LoginRepositoryMock())
  }

  public override async execute(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.resultProvider(phoneNumber)
  }
}
