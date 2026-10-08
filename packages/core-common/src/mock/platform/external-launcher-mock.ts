import type { ExternalLauncher } from '@/platform/external-launcher/external-launcher'

/**
 * Mock implementation of {@link ExternalLauncher} for recording external browser, mail, and file launch actions in tests.
 */
export class ExternalLauncherMock implements ExternalLauncher {
  public openedUrls: string[] = []
  public openedMails: Array<{ email: string; subject?: string | null; body?: string | null }> = []
  public openedFiles: string[] = []

  /**
   * Records opening an external URL.
   *
   * @param url - Destination URL
   */
  public openUrl(url: string): void {
    this.openedUrls.push(url)
  }

  /**
   * Records opening a mail client link.
   *
   * @param email - Target email address
   * @param subject - Optional subject line
   * @param body - Optional email body
   */
  public openMail(email: string, subject?: string | null, body?: string | null): void {
    this.openedMails.push({ email, subject, body })
  }

  /**
   * Records opening an external file link.
   *
   * @param url - URL of file to open
   */
  public openFile(url: string): void {
    this.openedFiles.push(url)
  }
}
