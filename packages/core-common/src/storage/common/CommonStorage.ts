/**
 * Interface for core platform credential storage.
 */
export interface CommonStorage {
  /**
   * Retrieves persistent device identifier.
   *
   * @returns Device ID string or null if absent
   */
  getDeviceId(): Promise<string | null>

  /**
   * Updates or sets persistent device identifier.
   *
   * @param deviceId - Device identifier string
   */
  updateDeviceId(deviceId: string): Promise<void>

  /**
   * Clears common storage entries.
   */
  clear(): Promise<void>
}
