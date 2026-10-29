import type { AppError, AppResult, EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  callResult,
  appResultSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  openStorageSettingsPayloadSchema,
  toOpenStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsStorage } from './open-storage-settings-storage'

/** Storage key under which open storage settings payload is encrypted and cached. */
const STORAGE_KEY = 'open_storage_settings'

/**
 * Encrypted implementation of {@link OpenStorageSettingsStorage} using {@link EncryptedSettings}.
 */
export class EncryptedOpenStorageSettingsStorage implements OpenStorageSettingsStorage {
  /**
   * Constructs a new {@link EncryptedOpenStorageSettingsStorage}.
   *
   * @param encryptedSettings - Encrypted settings store
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Reads cached open storage settings from persistent local storage.
   *
   * @returns A promise resolving to an {@link AppResult} containing cached {@link OpenStorageSettings} or null if not found
   */
  public async getSettings(): Promise<AppResult<OpenStorageSettings | null, AppError>> {
    return callResult(async () => {
      const json = await this.encryptedSettings.get(STORAGE_KEY)
      if (!json) {
        return null
      }
      const rawPayload = JSON.parse(json) as unknown
      const payload = openStorageSettingsPayloadSchema.parse(rawPayload)
      return toOpenStorageSettings(payload)
    })
  }

  /**
   * Saves open storage settings into persistent local storage.
   *
   * @param settings - Open storage settings domain model to persist
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  public async saveSettings(settings: OpenStorageSettings): Promise<AppResult<void, AppError>> {
    return callResult(async () => {
      const json = JSON.stringify({
        min_upload_size_bytes: settings.minUploadSizeBytes,
        max_upload_size_bytes: settings.maxUploadSizeBytes
      })
      await this.encryptedSettings.put(STORAGE_KEY, json)
    })
  }

  /**
   * Clears cached open storage settings from persistent local storage.
   *
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  public async clearSettings(): Promise<AppResult<void, AppError>> {
    return callResult(async () => {
      await this.encryptedSettings.remove(STORAGE_KEY)
      return appResultSuccess(undefined).data
    })
  }
}
