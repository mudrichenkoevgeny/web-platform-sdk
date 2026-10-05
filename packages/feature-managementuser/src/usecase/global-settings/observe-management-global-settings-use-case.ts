import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '@/repository/global-settings/management-global-settings-repository'

/** Observes live global settings updates. */
export class ObserveManagementGlobalSettingsUseCase {
  /**
   * Constructs a new {@link ObserveManagementGlobalSettingsUseCase}.
   *
   * @param managementGlobalSettingsRepository - Management global settings repository
   */
  public constructor(private readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository) {}

  /**
   * Subscribes to global settings updates.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  public execute(listener: (settings: ManagementGlobalSettings | null) => void): () => void {
    return this.managementGlobalSettingsRepository.observeManagementGlobalSettings(listener)
  }
}
