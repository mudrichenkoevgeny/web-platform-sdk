import type { EncryptedSettings } from '@/storage/encrypted-settings'
import type { CommonStorage } from '@/storage/common/common-storage'

/**
 * CommonStorage implementation backed by {@link EncryptedSettings}.
 */
export class EncryptedCommonStorage implements CommonStorage {
  private static readonly KEY_DEVICE_ID = 'device_id'

  /**
   * Constructs a new {@link EncryptedCommonStorage}.
   *
   * @param encryptedSettings - Encrypted settings store instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Retrieves persistent device ID from encrypted storage.
   *
   * @returns Device ID string or null
   */
  public async getDeviceId(): Promise<string | null> {
    return this.encryptedSettings.get(EncryptedCommonStorage.KEY_DEVICE_ID)
  }

  /**
   * Stores persistent device ID into encrypted storage.
   *
   * @param deviceId - Device ID string
   */
  public async updateDeviceId(deviceId: string): Promise<void> {
    await this.encryptedSettings.put(EncryptedCommonStorage.KEY_DEVICE_ID, deviceId)
  }

  /**
   * Removes device ID from encrypted storage.
   */
  public async clear(): Promise<void> {
    await this.encryptedSettings.remove(EncryptedCommonStorage.KEY_DEVICE_ID)
  }
}
