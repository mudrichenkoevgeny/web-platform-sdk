import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/** Auth-related remote settings repository contract. */
export interface OpenAuthSettingsRepository {
  /** Returns cached settings when loaded; otherwise loads from network/storage. */
  getOpenAuthSettings(): Promise<AppResult<OpenAuthSettings, AppError>>

  /** Forces network reload and updates observable snapshot on success. */
  refreshOpenAuthSettings(): Promise<AppResult<OpenAuthSettings, AppError>>

  /** Persists authSettings and publishes them to observers. */
  updateOpenAuthSettings(authSettings: OpenAuthSettings): Promise<void>

  /** Observes in-memory settings snapshot. */
  observeOpenAuthSettings(listener: (settings: OpenAuthSettings | null) => void): () => void
}
