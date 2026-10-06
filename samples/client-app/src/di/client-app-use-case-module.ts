import type { RefreshClientUserConfigurationUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import { SyncDataUseCase } from '@/usecase/sync-data-use-case'

/**
 * Internal sample wiring that builds {@link SyncDataUseCase} from refresh user configuration use case.
 */
export class ClientAppUseCaseModule {
  public readonly syncDataUseCase: SyncDataUseCase

  public constructor(
    refreshUserConfigurationUseCase: RefreshClientUserConfigurationUseCase
  ) {
    this.syncDataUseCase = new SyncDataUseCase(
      refreshUserConfigurationUseCase
    )
  }
}
