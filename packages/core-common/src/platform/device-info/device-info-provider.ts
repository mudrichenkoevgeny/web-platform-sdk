import { ClientType } from '@mudrichenkoevgeny/shared-foundation'
import type { ClientDeviceInfoPayload, ClientDeviceId } from '@mudrichenkoevgeny/shared-foundation'
import type { CommonStorage } from '@/storage/common/common-storage'
import { UserAgentParser } from '@/platform/parser/user-agent-parser'

/**
 * Interface providing platform device metadata.
 */
export interface DeviceInfoProvider {
  /**
   * Resolves client device information payload.
   *
   * @returns Device info payload promise
   */
  getDeviceInfo(): Promise<ClientDeviceInfoPayload>
}

/**
 * Web browser implementation of {@link DeviceInfoProvider}.
 */
export class WebDeviceInfoProvider implements DeviceInfoProvider {
  /**
   * Constructs a new {@link WebDeviceInfoProvider}.
   *
   * @param commonStorage - Storage instance containing persistent device credentials
   * @param appVersion - Version string of the current application
   */
  public constructor(
    private readonly commonStorage: CommonStorage,
    private readonly appVersion: string = '"unspecified"'
  ) {}

  /**
   * Resolves browser and device metadata from navigator userAgent and storage.
   * Generates and persists a device ID if one does not already exist.
   *
   * @returns Device info payload
   */
  public async getDeviceInfo(): Promise<ClientDeviceInfoPayload> {
    let rawDeviceId = await this.commonStorage.getDeviceId()
    if (!rawDeviceId) {
      rawDeviceId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : this.generateUUID()
      await this.commonStorage.updateDeviceId(rawDeviceId)
    }

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const language = typeof navigator !== 'undefined' ? navigator.language : null

    const deviceName = userAgent ? UserAgentParser.getDeviceName(userAgent) : 'Web'
    const osName = 'web'

    return {
      client_type: ClientType.WEB,
      language: language ?? null,
      device_id: (rawDeviceId as ClientDeviceId) ?? null,
      device_name: deviceName,
      app_version: this.appVersion,
      operation_system_version: osName
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
