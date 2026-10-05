import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'

/** Observes the in-memory management auth settings snapshot. */
export class ObserveManagementAuthSettingsUseCase {
  /**
   * Constructs a new {@link ObserveManagementAuthSettingsUseCase}.
   *
   * @param managementAuthSettingsRepository - Management auth settings repository
   */
  public constructor(private readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository) {}

  /**
   * Subscribes to management auth settings updates.
   *
   * @param listener - Callback triggered when settings change
   * @returns Cleanup unsubscribe function
   */
  public execute(listener: (settings: ManagementAuthSettings | null) => void): () => void {
    return this.managementAuthSettingsRepository.observeManagementAuthSettings(listener)
  }
}
