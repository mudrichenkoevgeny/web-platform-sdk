export interface CommonStorage {
  getDeviceId(): Promise<string | null>
  updateDeviceId(deviceId: string): Promise<void>
  clear(): Promise<void>
}
