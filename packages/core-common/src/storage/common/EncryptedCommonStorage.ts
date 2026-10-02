import { EncryptedSettings } from '../EncryptedSettings'
import { CommonStorage } from './CommonStorage'

export class EncryptedCommonStorage implements CommonStorage {
  private static readonly KEY_DEVICE_ID = 'device_id'

  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  public async getDeviceId(): Promise<string | null> {
    return this.encryptedSettings.get(EncryptedCommonStorage.KEY_DEVICE_ID)
  }

  public async updateDeviceId(deviceId: string): Promise<void> {
    await this.encryptedSettings.put(EncryptedCommonStorage.KEY_DEVICE_ID, deviceId)
  }

  public async clear(): Promise<void> {
    await this.encryptedSettings.remove(EncryptedCommonStorage.KEY_DEVICE_ID)
  }
}
