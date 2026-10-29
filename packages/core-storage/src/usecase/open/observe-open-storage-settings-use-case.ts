import type {
  OpenStorageSettingsObserver,
  OpenStorageSettingsRepository
} from '../../repository/open/open-storage-settings-repository'

/** Subscribes an observer to live open storage settings updates. */
export class ObserveOpenStorageSettingsUseCase {
  /**
   * Constructs a new {@link ObserveOpenStorageSettingsUseCase}.
   *
   * @param repository - Open storage settings repository
   */
  public constructor(protected readonly repository: OpenStorageSettingsRepository) {}

  /**
   * Executes the use case to register an observer for settings changes.
   *
   * @param observer - Callback invoked when open storage settings are updated
   * @returns Unsubscribe cleanup function
   */
  public execute(observer: OpenStorageSettingsObserver): () => void {
    return this.repository.observeOpenStorageSettings(observer)
  }
}
