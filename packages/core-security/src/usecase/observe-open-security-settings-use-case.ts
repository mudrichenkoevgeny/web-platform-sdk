import type { OpenSecuritySettingsObserver, OpenSecuritySettingsRepository } from '../repository/open-security-settings-repository'

/** Subscribes an observer to live open security settings updates. */
export class ObserveOpenSecuritySettingsUseCase {
  /**
   * Constructs a new {@link ObserveOpenSecuritySettingsUseCase}.
   *
   * @param repository - Open security settings repository
   */
  public constructor(protected readonly repository: OpenSecuritySettingsRepository) {}

  /**
   * Executes the use case to register an observer for settings changes.
   *
   * @param observer - Callback invoked when open security settings are updated
   * @returns Unsubscribe cleanup function
   */
  public execute(observer: OpenSecuritySettingsObserver): () => void {
    return this.repository.observeOpenSecuritySettings(observer)
  }
}
