import type { OpenAuthSettingsRepository } from '@/repository/auth/settings/OpenAuthSettingsRepository'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Observes the in-memory public auth settings snapshot.
 */
export class ObserveAuthSettingsUseCase {
  /**
   * Constructs a new {@link ObserveAuthSettingsUseCase}.
   *
   * @param openAuthSettingsRepository - Remote auth settings repository
   */
  public constructor(private readonly openAuthSettingsRepository: OpenAuthSettingsRepository) {}

  /**
   * Subscribes to auth settings updates.
   *
   * @param listener - Callback function triggered on settings change
   * @returns Unsubscribe cleanup function
   */
  public invoke(listener: (settings: OpenAuthSettings | null) => void): () => void {
    return this.openAuthSettingsRepository.observeOpenAuthSettings(listener)
  }
}
