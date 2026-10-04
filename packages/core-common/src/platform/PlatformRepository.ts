import type { ClientDeviceInfoPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { DeviceInfoProvider } from '@/platform/deviceinfo/DeviceInfoProvider'
import type { ExternalLauncher } from '@/platform/externallauncher/ExternalLauncher'

/**
 * Repository interface for interacting with device platform capabilities.
 */
export interface PlatformRepository {
  /**
   * Retrieves client device information payload.
   *
   * @returns Device info payload
   */
  getDeviceInfo(): Promise<ClientDeviceInfoPayload>

  /**
   * Opens a URL in an external browser.
   *
   * @param url - Destination URL
   */
  openUrl(url: string): void

  /**
   * Opens a mail client composer.
   *
   * @param email - Target email address
   * @param subject - Optional email subject
   * @param body - Optional email body
   */
  openMail(email: string, subject?: string | null, body?: string | null): void

  /**
   * Opens an external file view link.
   *
   * @param url - File URL
   */
  openFile(url: string): void
}

/**
 * Implementation of {@link PlatformRepository} delegating to providers.
 */
export class PlatformRepositoryImpl implements PlatformRepository {
  /**
   * Constructs a new {@link PlatformRepositoryImpl}.
   *
   * @param deviceInfoProvider - Device information provider
   * @param externalLauncher - External launcher instance
   */
  public constructor(
    private readonly deviceInfoProvider: DeviceInfoProvider,
    private readonly externalLauncher: ExternalLauncher
  ) {}

  /**
   * Resolves device information payload.
   *
   * @returns Device metadata
   */
  public async getDeviceInfo(): Promise<ClientDeviceInfoPayload> {
    return this.deviceInfoProvider.getDeviceInfo()
  }

  /**
   * Delegates URL launching to external launcher.
   *
   * @param url - Target URL
   */
  public openUrl(url: string): void {
    this.externalLauncher.openUrl(url)
  }

  /**
   * Delegates mail launching to external launcher.
   *
   * @param email - Target email
   * @param subject - Email subject
   * @param body - Email body
   */
  public openMail(email: string, subject?: string | null, body?: string | null): void {
    this.externalLauncher.openMail(email, subject, body)
  }

  /**
   * Delegates file opening to external launcher.
   *
   * @param url - Target file URL
   */
  public openFile(url: string): void {
    this.externalLauncher.openFile(url)
  }
}
