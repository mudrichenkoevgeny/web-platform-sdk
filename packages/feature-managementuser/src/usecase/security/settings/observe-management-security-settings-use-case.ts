import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/ManagementSecuritySettingsRepository'

/** Observes live security settings updates. */
export class ObserveManagementSecuritySettingsUseCase {
  /**
   * Constructs a new {@link ObserveManagementSecuritySettingsUseCase}.
   *
   * @param managementSecuritySettingsRepository - Management security settings repository
   */
  public constructor(
    private readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository
  ) {}

  /**
   * Subscribes to live security settings updates.
   *
   * @param listener - Callback function triggered on settings update
   * @returns Unsubscribe cleanup function
   */
  public execute(listener: (settings: ManagementSecuritySettings | null) => void): () => void {
    return this.managementSecuritySettingsRepository.observeManagementSecuritySettings(listener)
  }
}
