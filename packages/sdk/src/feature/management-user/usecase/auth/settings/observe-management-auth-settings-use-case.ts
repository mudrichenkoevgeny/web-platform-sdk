import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '../../../repository/auth/settings/management-auth-settings-repository'

/** Subscribes an observer to live management auth settings updates. */
export class ObserveManagementAuthSettingsUseCase {
  /**
   * Constructs a new {@link ObserveManagementAuthSettingsUseCase}.
   *
   * @param repository - Management auth settings repository
   */
  public constructor(protected readonly repository: ManagementAuthSettingsRepository) {}

  /**
   * Executes the use case to register an observer for settings changes.
   *
   * @param listener - Callback invoked when management auth settings are updated
   * @returns Unsubscribe cleanup function
   */
  public execute(listener: (settings: ManagementAuthSettings | null) => void): () => void {
    return this.repository.observeManagementAuthSettings(listener)
  }
}
