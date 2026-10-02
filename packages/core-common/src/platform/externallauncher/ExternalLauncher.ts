export interface ExternalLauncher {
  openUrl(url: string): void
  openMail(email: string, subject?: string | null, body?: string | null): void
  openFile(url: string): void
}

export class WebExternalLauncher implements ExternalLauncher {
  public openUrl(url: string): void {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

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

  public openFile(url: string): void {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
  }
}

export const getExternalLauncher = (): ExternalLauncher => {
  return new WebExternalLauncher()
}
