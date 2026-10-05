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
    private readonly appVersion: string = '1.0.0'
  ) {}

  /**
   * Resolves browser and device metadata from navigator userAgent and storage.
   *
   * @returns Device info payload
   */
  public async getDeviceInfo(): Promise<ClientDeviceInfoPayload> {
    const rawDeviceId = await this.commonStorage.getDeviceId()
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const language = typeof navigator !== 'undefined' ? navigator.language : null

    const deviceName = userAgent ? UserAgentParser.getDeviceName(userAgent) : 'Web'
    const osName = userAgent ? UserAgentParser.getOs(userAgent) : 'Web'

    return {
      client_type: 'WEB',
      language: language ?? null,
      device_id: (rawDeviceId as ClientDeviceId) ?? null,
      device_name: deviceName,
      app_version: this.appVersion,
      operation_system_version: osName
    }
  }
}
