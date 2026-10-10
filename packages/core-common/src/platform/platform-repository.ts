import type { ClientDeviceInfoPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ClientDeviceInfoProvider } from '@/platform/device-info/client-device-info-provider'
import type { ExternalLauncher } from '@/platform/external-launcher/external-launcher'

/**
 * Repository interface for interacting with device platform capabilities.
 */
export interface PlatformRepository {
  /**
   * Retrieves client device information payload.
   *
   * @returns Client device info payload
   */
  getClientDeviceInfo(): Promise<ClientDeviceInfoPayload>

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
   * @param clientDeviceInfoProvider - Client device information provider
   * @param externalLauncher - External launcher instance
   */
  public constructor(
    private readonly clientDeviceInfoProvider: ClientDeviceInfoProvider,
    private readonly externalLauncher: ExternalLauncher
  ) {}

  /**
   * Resolves client device information payload.
   *
   * @returns Device metadata
   */
  public async getClientDeviceInfo(): Promise<ClientDeviceInfoPayload> {
    return this.clientDeviceInfoProvider.getClientDeviceInfo()
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
