import type { CommonStorage } from '@/storage/common/common-storage'

/**
 * Mock in-memory implementation of {@link CommonStorage} for storing device credentials during tests.
 */
export class CommonStorageMock implements CommonStorage {
  private deviceId: string | null = null

  /**
   * Retrieves the mock device ID.
   *
   * @returns Stored device ID or null
   */
  public async getDeviceId(): Promise<string | null> {
    return this.deviceId
  }

  /**
   * Sets the mock device ID.
   *
   * @param deviceId - Device identifier to store
   */
  public async updateDeviceId(deviceId: string): Promise<void> {
    this.deviceId = deviceId
  }

  /**
   * Clears all stored common storage data.
   */
  public async clear(): Promise<void> {
    this.deviceId = null
  }
}
