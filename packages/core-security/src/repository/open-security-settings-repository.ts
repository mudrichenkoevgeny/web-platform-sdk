import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenSecuritySettings } from '@/domain/model/open-security-settings'

/** Observer callback for security settings changes. */
export type OpenSecuritySettingsObserver = (settings: OpenSecuritySettings | null) => void

/**
 * Repository interface for retrieving, updating, and observing open security settings.
 */
export interface OpenSecuritySettingsRepository {
  /**
   * Retrieves in-memory or persisted settings. If unavailable, fetches from network.
   *
   * @returns AppResult containing current settings or error
   */
  getOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettings, AppError>>

  /**
   * Forces a network refresh of the open security settings and persists them.
   *
   * @returns AppResult containing updated settings or error
   */
  refreshOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettings, AppError>>

  /**
   * Applies an external update to the settings and persists them.
   *
   * @param securitySettings - New settings snapshot
   */
  updateOpenSecuritySettings(securitySettings: OpenSecuritySettings): Promise<void>

  /**
   * Registers an observer for live updates to the security settings.
   *
   * @param observer - Callback receiving updated settings or null
   * @returns Unsubscribe function
   */
  observeOpenSecuritySettings(observer: OpenSecuritySettingsObserver): () => void
}
