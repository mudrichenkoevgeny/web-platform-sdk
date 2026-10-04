import { OpenGlobalSettings } from '@/domain/model/OpenGlobalSettings'

/**
 * Persistence port for {@link OpenGlobalSettings} storage implementations.
 */
export interface OpenGlobalSettingsStorage {
  /**
   * Retrieves the stored {@link OpenGlobalSettings}, or null if none are persisted yet.
   *
   * @returns Promise resolving to stored settings or null
   */
  getOpenGlobalSettings(): Promise<OpenGlobalSettings | null>

  /**
   * Persists a new snapshot of {@link OpenGlobalSettings}.
   *
   * @param globalSettings - Snapshot to serialize and persist
   */
  updateOpenGlobalSettings(globalSettings: OpenGlobalSettings): Promise<void>

  /**
   * Removes persisted open global settings from storage, if present.
   */
  clearOpenGlobalSettings(): Promise<void>
}
