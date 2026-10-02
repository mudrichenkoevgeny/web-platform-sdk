import { ClientDeviceInfoPayload } from '@mudrichenkoevgeny/shared-foundation'
import { DeviceInfoProvider } from './deviceinfo/DeviceInfoProvider'
import { ExternalLauncher } from './externallauncher/ExternalLauncher'

export interface PlatformRepository {
  getDeviceInfo(): Promise<ClientDeviceInfoPayload>
  openUrl(url: string): void
  openMail(email: string, subject?: string | null, body?: string | null): void
  openFile(url: string): void
}

export class PlatformRepositoryImpl implements PlatformRepository {
  public constructor(
    private readonly deviceInfoProvider: DeviceInfoProvider,
    private readonly externalLauncher: ExternalLauncher
  ) {}

  public async getDeviceInfo(): Promise<ClientDeviceInfoPayload> {
    return this.deviceInfoProvider.getDeviceInfo()
  }

  public openUrl(url: string): void {
    this.externalLauncher.openUrl(url)
  }

  public openMail(email: string, subject?: string | null, body?: string | null): void {
    this.externalLauncher.openMail(email, subject, body)
  }

  public openFile(url: string): void {
    this.externalLauncher.openFile(url)
  }
}
