/**
 * Interface for launching external URLs, mail composition, and file viewers.
 */
export interface ExternalLauncher {
  /**
   * Opens an external HTTP/HTTPS web URL.
   *
   * @param url - Destination web URL
   */
  openUrl(url: string): void

  /**
   * Launches the mail client with pre-filled parameters.
   *
   * @param email - Target email address
   * @param subject - Optional subject line
   * @param body - Optional body text
   */
  openMail(email: string, subject?: string | null, body?: string | null): void

  /**
   * Opens an external file in browser or default viewer.
   *
   * @param url - Destination file URL
   */
  openFile(url: string): void
}

/**
 * Web browser implementation of {@link ExternalLauncher}.
 */
export class WebExternalLauncher implements ExternalLauncher {
  /**
   * Opens a URL in a new window/tab.
   *
   * @param url - Destination URL
   */
  public openUrl(url: string): void {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  /**
   * Opens mailto link in window.
   *
   * @param email - Target email
   * @param subject - Subject
   * @param body - Body
   */
  public openMail(email: string, subject?: string | null, body?: string | null): void {
    if (typeof window !== 'undefined') {
      let mailtoUrl = `mailto:${email}`
      const params: string[] = []

      if (subject) {
        params.push(`subject=${encodeURIComponent(subject)}`)
      }
      if (body) {
        params.push(`body=${encodeURIComponent(body)}`)
      }

      if (params.length > 0) {
        mailtoUrl += `?${params.join('&')}`
      }

      window.location.href = mailtoUrl
    }
  }

  /**
   * Opens a file URL in a new window/tab.
   *
   * @param url - Target file URL
   */
  public openFile(url: string): void {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
  }
}

/**
 * Factory function returning default external launcher instance.
 *
 * @returns {@link ExternalLauncher} instance
 */
export const getExternalLauncher = (): ExternalLauncher => {
  return new WebExternalLauncher()
}
