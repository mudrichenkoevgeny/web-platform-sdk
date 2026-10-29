import type { AppError, AppResult, EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  callResult,
  appResultSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  managementStorageSettingsPayloadSchema,
  toManagementStorageSettings,
  toManagementStorageSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsStorage } from './management-storage-settings-storage'

/** Storage key under which management storage settings payload is encrypted and cached. */
const STORAGE_KEY = 'management_storage_settings'

/**
 * Encrypted implementation of {@link ManagementStorageSettingsStorage} using {@link EncryptedSettings}.
 */
export class EncryptedManagementStorageSettingsStorage implements ManagementStorageSettingsStorage {
  /**
   * Constructs a new {@link EncryptedManagementStorageSettingsStorage} instance.
   *
   * @param encryptedSettings - Encrypted settings store abstraction
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Reads cached management storage settings from local encrypted storage.
   *
   * @returns AppResult containing cached {@link ManagementStorageSettings} or null if cache is empty
   */
  public async getSettings(): Promise<AppResult<ManagementStorageSettings | null, AppError>> {
    return callResult(async () => {
      const json = await this.encryptedSettings.get(STORAGE_KEY)
      if (!json) {
        return null
      }
      const rawPayload = JSON.parse(json) as unknown
      const payload = managementStorageSettingsPayloadSchema.parse(rawPayload)
      return toManagementStorageSettings(payload)
    })
  }

  /**
   * Persists management storage settings into local encrypted storage.
   *
   * @param settings - Management storage settings object to cache
   * @returns AppResult containing void on success
   */
  public async saveSettings(settings: ManagementStorageSettings): Promise<AppResult<void, AppError>> {
    return callResult(async () => {
      const payload = toManagementStorageSettingsPayload(settings)
      const json = JSON.stringify(payload)
      await this.encryptedSettings.put(STORAGE_KEY, json)
    })
  }

  /**
   * Clears cached management storage settings from local encrypted storage.
   *
   * @returns AppResult containing void on success
   */
  public async clearSettings(): Promise<AppResult<void, AppError>> {
    return callResult(async () => {
      await this.encryptedSettings.remove(STORAGE_KEY)
      return appResultSuccess(undefined).data
    })
  }
}
