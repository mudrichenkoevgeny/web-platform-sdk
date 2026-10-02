import { describe, it, expect, vi } from 'vitest'
import { WebExternalLauncher, getExternalLauncher } from './ExternalLauncher'

describe('WebExternalLauncher', () => {
  it('openUrl calls window.open with noopener,noreferrer', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const launcher = new WebExternalLauncher()

    launcher.openUrl('https://example.com')

    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
    openSpy.mockRestore()
  })

  it('openMail constructs mailto link with %20 for spaces', () => {
    const launcher = new WebExternalLauncher()
    const originalHref = window.location.href

    launcher.openMail('test@example.com', 'Hello', 'World Body')

    expect(window.location.href).toBe('mailto:test@example.com?subject=Hello&body=World%20Body')
    window.location.href = originalHref
  })

  it('openFile calls window.open', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const launcher = new WebExternalLauncher()

    launcher.openFile('https://example.com/file.pdf')

    expect(openSpy).toHaveBeenCalledWith('https://example.com/file.pdf', '_blank')
    openSpy.mockRestore()
  })

  it('getExternalLauncher returns WebExternalLauncher instance', () => {
    const launcher = getExternalLauncher()
    expect(launcher).toBeInstanceOf(WebExternalLauncher)
  })
})
