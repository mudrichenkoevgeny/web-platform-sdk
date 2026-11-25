import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenAuthSettingsRepository } from '../../../repository/auth/settings/open-auth-settings-repository'

/** Subscribes an observer to live open auth settings updates. */
export class ObserveOpenAuthSettingsUseCase {
  /**
   * Constructs a new {@link ObserveOpenAuthSettingsUseCase}.
   *
   * @param repository - Open auth settings repository
   */
  public constructor(protected readonly repository: OpenAuthSettingsRepository) {}

  /**
   * Executes the use case to register an observer for settings changes.
   *
   * @param listener - Callback invoked when open auth settings are updated
   * @returns Unsubscribe cleanup function
   */
  public execute(listener: (settings: OpenAuthSettings | null) => void): () => void {
    return this.repository.observeOpenAuthSettings(listener)
  }
}
