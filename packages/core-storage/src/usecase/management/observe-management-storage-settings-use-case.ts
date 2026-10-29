import type {
  ManagementStorageSettingsObserver,
  ManagementStorageSettingsRepository
} from '../../repository/management/management-storage-settings-repository'

/** Subscribes an observer to live management storage settings updates. */
export class ObserveManagementStorageSettingsUseCase {
  /**
   * Constructs a new {@link ObserveManagementStorageSettingsUseCase}.
   *
   * @param repository - Management storage settings repository
   */
  public constructor(protected readonly repository: ManagementStorageSettingsRepository) {}

  /**
   * Executes the use case to register an observer for settings changes.
   *
   * @param observer - Callback invoked when management storage settings are updated
   * @returns Unsubscribe cleanup function
   */
  public execute(observer: ManagementStorageSettingsObserver): () => void {
    return this.repository.observeSettings(observer)
  }
}
