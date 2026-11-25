import type { OpenGlobalSettingsObserver, OpenGlobalSettingsRepository } from '../repository/open-global-settings-repository'

/** Subscribes an observer to live open global settings updates. */
export class ObserveOpenGlobalSettingsUseCase {
  /**
   * Constructs a new {@link ObserveOpenGlobalSettingsUseCase}.
   *
   * @param repository - Open global settings repository
   */
  public constructor(protected readonly repository: OpenGlobalSettingsRepository) {}

  /**
   * Executes the use case to register an observer for settings changes.
   *
   * @param observer - Callback invoked when open global settings are updated
   * @returns Unsubscribe cleanup function
   */
  public execute(observer: OpenGlobalSettingsObserver): () => void {
    return this.repository.observeOpenGlobalSettings(observer)
  }
}
