import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { SendAddEmailIdentifierConfirmationUseCase } from '@/usecase/identifier/SendAddEmailIdentifierConfirmationUseCase'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/repository/identifier/IdentifierRepositoryMock'
/** Mock implementation of {@link SendAddEmailIdentifierConfirmationUseCase}. */
export class SendAddEmailIdentifierConfirmationUseCaseMock extends SendAddEmailIdentifierConfirmationUseCase {
  public executeCalls = 0
  public resultProvider: (email: string) => Promise<AppResult<OtpConfirmation, AppError>> =
    async () => appResultSuccess({ retryAfterSeconds: 60, numberOfSymbols: 6, expirationSeconds: 300 })

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async invoke(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.executeCalls++
    return this.resultProvider(email)
  }
}
