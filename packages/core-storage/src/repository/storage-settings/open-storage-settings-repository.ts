import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Observer callback for open storage settings updates. */
export type OpenStorageSettingsObserver = (settings: OpenStorageSettings | null) => void

/** Central repository contract for open storage settings. */
export interface OpenStorageSettingsRepository {
  /** Retrieves open storage settings from cache or network. */
  getOpenStorageSettings(): Promise<AppResult<OpenStorageSettings, AppError>>
  /** Forces a refresh from network and persists result. */
  refreshOpenStorageSettings(): Promise<AppResult<OpenStorageSettings, AppError>>
  /** Overwrites active open storage settings. */
  updateOpenStorageSettings(storageSettings: OpenStorageSettings): Promise<void>
  /** Subscribes to open storage settings updates. */
  observeOpenStorageSettings(observer: OpenStorageSettingsObserver): () => void
}
