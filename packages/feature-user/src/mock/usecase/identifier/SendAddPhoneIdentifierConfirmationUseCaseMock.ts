import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { SendAddPhoneIdentifierConfirmationUseCase } from '@/usecase/identifier/SendAddPhoneIdentifierConfirmationUseCase'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/repository/identifier/IdentifierRepositoryMock'
/** Mock implementation of {@link SendAddPhoneIdentifierConfirmationUseCase}. */
export class SendAddPhoneIdentifierConfirmationUseCaseMock extends SendAddPhoneIdentifierConfirmationUseCase {
  public executeCalls = 0
  public resultProvider: (phone: string) => Promise<AppResult<OtpConfirmation, AppError>> =
    async () => appResultSuccess({ retryAfterSeconds: 60, numberOfSymbols: 6, expirationSeconds: 300 })

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async invoke(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.executeCalls++
    return this.resultProvider(phoneNumber)
  }
}
