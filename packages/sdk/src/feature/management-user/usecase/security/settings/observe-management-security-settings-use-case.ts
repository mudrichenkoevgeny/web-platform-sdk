import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '../../../repository/security/settings/management-security-settings-repository'

/** Subscribes an observer to live management security settings updates. */
export class ObserveManagementSecuritySettingsUseCase {
  /**
   * Constructs a new {@link ObserveManagementSecuritySettingsUseCase}.
   *
   * @param repository - Management security settings repository
   */
  public constructor(protected readonly repository: ManagementSecuritySettingsRepository) {}

  /**
   * Executes the use case to register an observer for settings changes.
   *
   * @param listener - Callback invoked when management security settings are updated
   * @returns Unsubscribe cleanup function
   */
  public execute(listener: (settings: ManagementSecuritySettings | null) => void): () => void {
    return this.repository.observeManagementSecuritySettings(listener)
  }
}
