import { ClientType } from '@mudrichenkoevgeny/shared-foundation'
import type { ClientDeviceInfoPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ClientDeviceInfoProvider } from '@/platform/device-info/client-device-info-provider'

/**
 * Mock implementation of {@link ClientDeviceInfoProvider} for supplying predictable device metadata in tests.
 */
export class ClientDeviceInfoProviderMock implements ClientDeviceInfoProvider {
  public mockDeviceInfo: ClientDeviceInfoPayload = {
    client_type: ClientType.WEB,
    language: 'en',
    device_id: null,
    device_name: 'Mock Device',
    app_version: '1.0.0-mock',
    operation_system_version: 'Mock OS'
  }

  /**
   * Initializes a new instance of {@link ClientDeviceInfoProviderMock}.
   *
   * @param overrides - Partial fields to override default mock device information
   */
  public constructor(overrides?: Partial<ClientDeviceInfoPayload>) {
    if (overrides) {
      this.mockDeviceInfo = {
        ...this.mockDeviceInfo,
        ...overrides
      }
    }
  }

  /**
   * Retrieves mock client device information payload.
   *
   * @returns Resolved device metadata payload
   */
  public async getClientDeviceInfo(): Promise<ClientDeviceInfoPayload> {
    return this.mockDeviceInfo
  }
}
