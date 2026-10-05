import { appResultFailure, appResultSuccess, CommonError, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { AppType, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenAuthSettingsRepository } from '@/repository/auth/settings/OpenAuthSettingsRepository'
import type { AvailableAuthProviders } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Loads auth settings and exposes which sign-in providers the backend allows for this app.
 */
export class GetAvailableUserAuthProvidersUseCase {
  /**
   * Constructs a new {@link GetAvailableUserAuthProvidersUseCase}.
   *
   * @param appType - Target operational application context
   * @param openAuthSettingsRepository - Remote auth settings repository
   */
  public constructor(
    private readonly appType: AppType,
    private readonly openAuthSettingsRepository?: OpenAuthSettingsRepository | null
  ) {}

  /**
   * Invokes the use case.
   *
   * @returns AvailableAuthProviders allowed for current app type
   */
  public async execute(): Promise<AppResult<AvailableAuthProviders, AppError>> {
    switch (this.appType) {
      case AppType.CLIENT: {
        if (!this.openAuthSettingsRepository) {
          return appResultFailure(
            CommonError.contractViolation(
              'OpenAuthSettingsRepository is required for AppType.CLIENT'
            )
          )
        }

        const result = await this.openAuthSettingsRepository.getOpenAuthSettings()
        return mapSuccess(result, (authSettings) => authSettings.availableAuthProviders)
      }
      case AppType.MANAGEMENT: {
        return appResultSuccess({
          primary: [UserAuthProvider.EMAIL],
          secondary: []
        })
      }
      default: {
        const exhaustiveCheck: never = this.appType
        throw new Error(`Unsupported AppType: ${exhaustiveCheck}`)
      }
    }
  }
}
