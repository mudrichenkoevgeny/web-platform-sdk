import type { ClientDeviceInfoPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { PlatformRepository } from '@/platform/platform-repository'
import { ClientDeviceInfoProviderMock } from '@/mock/platform/client-device-info-provider-mock'
import { ExternalLauncherMock } from '@/mock/platform/external-launcher-mock'

/**
 * Mock implementation of {@link PlatformRepository} combining device information and external launching mocks.
 */
export class PlatformRepositoryMock implements PlatformRepository {
  public readonly clientDeviceInfoProviderMock: ClientDeviceInfoProviderMock
  public readonly externalLauncherMock: ExternalLauncherMock

  /**
   * Initializes a new instance of {@link PlatformRepositoryMock}.
   *
   * @param clientDeviceInfoProviderMock - Optional custom device info provider mock
   * @param externalLauncherMock - Optional custom external launcher mock
   */
  public constructor(
    clientDeviceInfoProviderMock?: ClientDeviceInfoProviderMock,
    externalLauncherMock?: ExternalLauncherMock
  ) {
    this.clientDeviceInfoProviderMock = clientDeviceInfoProviderMock ?? new ClientDeviceInfoProviderMock()
    this.externalLauncherMock = externalLauncherMock ?? new ExternalLauncherMock()
  }

  /**
   * Delegates retrieving device information to the internal device info mock.
   *
   * @returns Device info payload
   */
  public async getClientDeviceInfo(): Promise<ClientDeviceInfoPayload> {
    return this.clientDeviceInfoProviderMock.getClientDeviceInfo()
  }

  /**
   * Delegates URL launching to the internal external launcher mock.
   *
   * @param url - Target URL
   */
  public openUrl(url: string): void {
    this.externalLauncherMock.openUrl(url)
  }

  /**
   * Delegates mail client opening to the internal external launcher mock.
   *
   * @param email - Target email
   * @param subject - Email subject
   * @param body - Email body content
   */
  public openMail(email: string, subject?: string | null, body?: string | null): void {
    this.externalLauncherMock.openMail(email, subject, body)
  }

  /**
   * Delegates file opening to the internal external launcher mock.
   *
   * @param url - Target file URL
   */
  public openFile(url: string): void {
    this.externalLauncherMock.openFile(url)
  }
}
