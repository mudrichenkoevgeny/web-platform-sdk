import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { SendAddEmailIdentifierConfirmationUseCase } from '@/usecase/identifier/send-add-email-identifier-confirmation-use-case'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'
/** Mock implementation of {@link SendAddEmailIdentifierConfirmationUseCase}. */
export class SendAddEmailIdentifierConfirmationUseCaseMock extends SendAddEmailIdentifierConfirmationUseCase {
  public executeCalls = 0
  public resultProvider: (email: string) => Promise<AppResult<OtpConfirmation, AppError>> =
    async () => appResultSuccess({ retryAfterSeconds: 60, numberOfSymbols: 6, expirationSeconds: 300 })

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.executeCalls++
    return this.resultProvider(email)
  }
}
