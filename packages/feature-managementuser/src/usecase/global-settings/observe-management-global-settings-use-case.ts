import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '../../repository/global-settings/management-global-settings-repository'

/** Subscribes an observer to live management global settings updates. */
export class ObserveManagementGlobalSettingsUseCase {
  /**
   * Constructs a new {@link ObserveManagementGlobalSettingsUseCase}.
   *
   * @param repository - Management global settings repository
   */
  public constructor(protected readonly repository: ManagementGlobalSettingsRepository) {}

  /**
   * Executes the use case to register an observer for settings changes.
   *
   * @param listener - Callback invoked when management global settings are updated
   * @returns Unsubscribe cleanup function
   */
  public execute(listener: (settings: ManagementGlobalSettings | null) => void): () => void {
    return this.repository.observeManagementGlobalSettings(listener)
  }
}
