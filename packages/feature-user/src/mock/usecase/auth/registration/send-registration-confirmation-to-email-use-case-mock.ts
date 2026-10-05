import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { SendRegistrationConfirmationToEmailUseCase } from '@/usecase/auth/registration/send-registration-confirmation-to-email-use-case'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { RegistrationRepositoryMock } from '@/mock/repository/auth/registration/registration-repository-mock'
/**
 * Mock implementation of {@link SendRegistrationConfirmationToEmailUseCase}.
 */
export class SendRegistrationConfirmationToEmailUseCaseMock extends SendRegistrationConfirmationToEmailUseCase {
  public resultProvider: (email: string) => Promise<AppResult<OtpConfirmation, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new RegistrationRepositoryMock())
  }

  public override async execute(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.resultProvider(email)
  }
}
