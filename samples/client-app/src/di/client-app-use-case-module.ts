import type { RefreshOpenSecuritySettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { RefreshOpenGlobalSettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { RefreshOpenAuthSettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import { SyncDataUseCase } from '@/usecase/sync-data-use-case'

/**
 * Internal sample wiring that builds {@link SyncDataUseCase} from module refresh use cases.
 */
export class ClientAppUseCaseModule {
  public readonly syncDataUseCase: SyncDataUseCase

  public constructor(
    refreshOpenGlobalSettingsUseCase: RefreshOpenGlobalSettingsUseCase,
    refreshOpenSecuritySettingsUseCase: RefreshOpenSecuritySettingsUseCase,
    refreshOpenAuthSettingsUseCase: RefreshOpenAuthSettingsUseCase
  ) {
    this.syncDataUseCase = new SyncDataUseCase(
      refreshOpenGlobalSettingsUseCase,
      refreshOpenSecuritySettingsUseCase,
      refreshOpenAuthSettingsUseCase
    )
  }
}
