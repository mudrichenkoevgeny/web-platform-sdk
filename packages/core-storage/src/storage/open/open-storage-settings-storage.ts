import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Storage interface for caching public open storage settings locally.
 */
export interface OpenStorageSettingsStorage {
  /**
   * Reads cached open storage settings from persistent local storage.
   *
   * @returns A promise resolving to an {@link AppResult} containing cached {@link OpenStorageSettings} or null if not found
   */
  getSettings(): Promise<AppResult<OpenStorageSettings | null, AppError>>

  /**
   * Saves open storage settings into persistent local storage.
   *
   * @param settings - Open storage settings domain model to persist
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  saveSettings(settings: OpenStorageSettings): Promise<AppResult<void, AppError>>

  /**
   * Clears cached open storage settings from persistent local storage.
   *
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  clearSettings(): Promise<AppResult<void, AppError>>
}
