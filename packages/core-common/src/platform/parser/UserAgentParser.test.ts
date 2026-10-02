import { describe, it, expect } from 'vitest'
import { UserAgentParser } from './UserAgentParser'

describe('UserAgentParser', () => {
  it('parses Chrome on Windows 10/11', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    expect(UserAgentParser.getBrowser(ua)).toBe('Chrome')
    expect(UserAgentParser.getOs(ua)).toBe('Windows 10/11')
    expect(UserAgentParser.getDeviceName(ua)).toBe('Chrome on Windows 10/11')
  })

  it('parses Safari on macOS', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
    expect(UserAgentParser.getBrowser(ua)).toBe('Safari')
    expect(UserAgentParser.getOs(ua)).toBe('macOS')
    expect(UserAgentParser.getDeviceName(ua)).toBe('Safari on macOS')
  })

  it('parses Firefox on Linux', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0'
    expect(UserAgentParser.getBrowser(ua)).toBe('Firefox')
    expect(UserAgentParser.getOs(ua)).toBe('Linux')
    expect(UserAgentParser.getDeviceName(ua)).toBe('Firefox on Linux')
  })

  it('parses Edge on Windows', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    expect(UserAgentParser.getBrowser(ua)).toBe('Edge')
  })

  it('parses Safari on iPhone (iOS)', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    expect(UserAgentParser.getBrowser(ua)).toBe('Safari')
    expect(UserAgentParser.getOs(ua)).toBe('iOS')
  })

  it('returns Web Browser and Web for unknown user agent', () => {
    const ua = 'CustomUnknownAgent/1.0'
    expect(UserAgentParser.getBrowser(ua)).toBe('Web Browser')
    expect(UserAgentParser.getOs(ua)).toBe('Web')
    expect(UserAgentParser.getDeviceName(ua)).toBe('Web Browser on Web')
  })
})
