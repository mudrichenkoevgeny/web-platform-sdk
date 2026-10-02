import { ClientDeviceInfoPayload, ClientDeviceId } from '@mudrichenkoevgeny/shared-foundation'
import { CommonStorage } from '../../storage/common/CommonStorage'
import { UserAgentParser } from '../parser/UserAgentParser'

export interface DeviceInfoProvider {
  getDeviceInfo(): Promise<ClientDeviceInfoPayload>
}

export class WebDeviceInfoProvider implements DeviceInfoProvider {
  public constructor(
    private readonly commonStorage: CommonStorage,
    private readonly appVersion: string = '1.0.0'
  ) {}

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
