import type {
  RefreshManagementAuthSettingsUseCase,
  RefreshManagementGlobalSettingsUseCase,
  RefreshManagementSecuritySettingsUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { SyncManagementDataUseCase } from '@/usecase/sync-management-data-use-case'

/**
 * Internal sample wiring that builds {@link SyncManagementDataUseCase} from module refresh use cases.
 */
export class ManagementAppUseCaseModule {
  public readonly syncManagementDataUseCase: SyncManagementDataUseCase

  public constructor(
    refreshManagementGlobalSettingsUseCase: RefreshManagementGlobalSettingsUseCase,
    refreshManagementSecuritySettingsUseCase: RefreshManagementSecuritySettingsUseCase,
    refreshManagementAuthSettingsUseCase: RefreshManagementAuthSettingsUseCase
  ) {
    this.syncManagementDataUseCase = new SyncManagementDataUseCase(
      refreshManagementGlobalSettingsUseCase,
      refreshManagementSecuritySettingsUseCase,
      refreshManagementAuthSettingsUseCase
    )
  }
}
