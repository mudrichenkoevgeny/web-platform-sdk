import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { SendRegistrationConfirmationToEmailUseCase } from '@/usecase/auth/registration/SendRegistrationConfirmationToEmailUseCase'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { RegistrationRepositoryMock } from '@/repository/auth/registration/RegistrationRepositoryMock'
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
