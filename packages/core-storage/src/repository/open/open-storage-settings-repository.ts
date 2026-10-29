import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Observer callback type for open storage settings changes. */
export type OpenStorageSettingsObserver = (settings: OpenStorageSettings) => void

/**
 * Repository interface for managing open storage settings data and live WebSocket synchronization.
 */
export interface OpenStorageSettingsRepository {
  /**
   * Retrieves open storage settings from local storage or network if missing.
   *
   * @returns A promise resolving to an {@link AppResult} containing {@link OpenStorageSettings} or {@link AppError}
   */
  getSettings(): Promise<AppResult<OpenStorageSettings, AppError>>

  /**
   * Forces a fresh fetch of open storage settings from the server.
   *
   * @returns A promise resolving to an {@link AppResult} containing fresh {@link OpenStorageSettings} or {@link AppError}
   */
  refreshSettings(): Promise<AppResult<OpenStorageSettings, AppError>>

  /**
   * Updates cached open storage settings in local encrypted storage.
   *
   * @param settings - Updated open storage settings domain model
   */
  updateOpenStorageSettings(settings: OpenStorageSettings): Promise<void>

  /**
   * Registers an observer callback triggered on live WebSocket settings updates.
   *
   * @param observer - Callback function invoked with updated settings
   * @returns Unsubscribe cleanup function
   */
  observeOpenStorageSettings(observer: OpenStorageSettingsObserver): () => void
}
