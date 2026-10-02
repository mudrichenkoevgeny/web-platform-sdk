import { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettings } from '../domain/model/OpenGlobalSettings'

/** Observer callback signature for global settings changes. */
export type OpenGlobalSettingsObserver = (settings: OpenGlobalSettings | null) => void

/**
 * Repository interface for retrieving, updating, and observing open global application settings.
 */
export interface OpenGlobalSettingsRepository {
  /**
   * Retrieves in-memory or persisted settings. If unavailable, fetches from network.
   *
   * @returns AppResult containing current settings or error
   */
  getOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettings, AppError>>

  /**
   * Forces a network refresh of the open global settings and persists them.
   *
   * @returns AppResult containing updated settings or error
   */
  refreshOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettings, AppError>>

  /**
   * Applies an external update to the settings and persists them.
   *
   * @param globalSettings - New settings snapshot
   */
  updateOpenGlobalSettings(globalSettings: OpenGlobalSettings): Promise<void>

  /**
   * Registers an observer for live updates to the global settings.
   *
   * @param observer - Callback receiving updated settings or null
   * @returns Unsubscribe function
   */
  observeOpenGlobalSettings(observer: OpenGlobalSettingsObserver): () => void
}
