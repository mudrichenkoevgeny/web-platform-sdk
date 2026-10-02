export class UserAgentParser {
  private static readonly BROWSER_TOKEN_EDGE = 'Edg/'
  private static readonly BROWSER_TOKEN_OPERA_OPR = 'OPR/'
  private static readonly BROWSER_TOKEN_OPERA = 'Opera'
  private static readonly BROWSER_TOKEN_VIVALDI = 'Vivaldi/'
  private static readonly BROWSER_TOKEN_YANDEX = 'YaBrowser/'
  private static readonly BROWSER_TOKEN_CHROME = 'Chrome/'
  private static readonly BROWSER_TOKEN_FIREFOX = 'Firefox/'
  private static readonly BROWSER_TOKEN_SAFARI = 'Safari/'

  private static readonly BROWSER_NAME_EDGE = 'Edge'
  private static readonly BROWSER_NAME_OPERA = 'Opera'
  private static readonly BROWSER_NAME_VIVALDI = 'Vivaldi'
  private static readonly BROWSER_NAME_YANDEX = 'Yandex Browser'
  private static readonly BROWSER_NAME_CHROME = 'Chrome'
  private static readonly BROWSER_NAME_FIREFOX = 'Firefox'
  private static readonly BROWSER_NAME_SAFARI = 'Safari'
  private static readonly BROWSER_NAME_UNKNOWN = 'Web Browser'

  private static readonly OS_TOKEN_WINDOWS_10_OR_11 = 'Windows NT 10.0'
  private static readonly OS_TOKEN_WINDOWS_NT = 'Windows NT'
  private static readonly OS_TOKEN_MACINTOSH = 'Macintosh'
  private static readonly OS_TOKEN_MAC_OS_X = 'Mac OS X'
  private static readonly OS_TOKEN_IPHONE = 'iPhone'
  private static readonly OS_TOKEN_IPAD = 'iPad'
  private static readonly OS_TOKEN_IPOD = 'iPod'
  private static readonly OS_TOKEN_ANDROID = 'Android'
  private static readonly OS_TOKEN_LINUX = 'Linux'
  private static readonly OS_TOKEN_CHROME_OS = 'CrOS'

  private static readonly OS_NAME_WINDOWS_10_OR_11 = 'Windows 10/11'
  private static readonly OS_NAME_WINDOWS = 'Windows'
  private static readonly OS_NAME_MACOS = 'macOS'
  private static readonly OS_NAME_IOS = 'iOS'
  private static readonly OS_NAME_ANDROID = 'Android'
  private static readonly OS_NAME_LINUX = 'Linux'
  private static readonly OS_NAME_CHROME_OS = 'ChromeOS'
  private static readonly OS_NAME_UNKNOWN = 'Web'

  public static getDeviceName(userAgent: string): string {
    const browser = UserAgentParser.getBrowser(userAgent)
    const os = UserAgentParser.getOs(userAgent)
    return `${browser} on ${os}`
  }

  public static getBrowser(userAgent: string): string {
    if (userAgent.includes(UserAgentParser.BROWSER_TOKEN_EDGE)) {
      return UserAgentParser.BROWSER_NAME_EDGE
    }
    if (
      userAgent.includes(UserAgentParser.BROWSER_TOKEN_OPERA_OPR) ||
      userAgent.includes(UserAgentParser.BROWSER_TOKEN_OPERA)
    ) {
      return UserAgentParser.BROWSER_NAME_OPERA
    }
    if (userAgent.includes(UserAgentParser.BROWSER_TOKEN_VIVALDI)) {
      return UserAgentParser.BROWSER_NAME_VIVALDI
    }
    if (userAgent.includes(UserAgentParser.BROWSER_TOKEN_YANDEX)) {
      return UserAgentParser.BROWSER_NAME_YANDEX
    }
    if (userAgent.includes(UserAgentParser.BROWSER_TOKEN_CHROME)) {
      return UserAgentParser.BROWSER_NAME_CHROME
    }
    if (userAgent.includes(UserAgentParser.BROWSER_TOKEN_FIREFOX)) {
      return UserAgentParser.BROWSER_NAME_FIREFOX
    }
    if (
      userAgent.includes(UserAgentParser.BROWSER_TOKEN_SAFARI) &&
      !userAgent.includes(UserAgentParser.BROWSER_TOKEN_CHROME)
    ) {
      return UserAgentParser.BROWSER_NAME_SAFARI
    }
    return UserAgentParser.BROWSER_NAME_UNKNOWN
  }

  public static getOs(userAgent: string): string {
    if (userAgent.includes(UserAgentParser.OS_TOKEN_WINDOWS_10_OR_11)) {
      return UserAgentParser.OS_NAME_WINDOWS_10_OR_11
    }
    if (userAgent.includes(UserAgentParser.OS_TOKEN_WINDOWS_NT)) {
      return UserAgentParser.OS_NAME_WINDOWS
    }
    if (
      userAgent.includes(UserAgentParser.OS_TOKEN_IPHONE) ||
      userAgent.includes(UserAgentParser.OS_TOKEN_IPAD) ||
      userAgent.includes(UserAgentParser.OS_TOKEN_IPOD)
    ) {
      return UserAgentParser.OS_NAME_IOS
    }
    if (
      userAgent.includes(UserAgentParser.OS_TOKEN_MACINTOSH) ||
      userAgent.includes(UserAgentParser.OS_TOKEN_MAC_OS_X)
    ) {
      return UserAgentParser.OS_NAME_MACOS
    }
    if (userAgent.includes(UserAgentParser.OS_TOKEN_ANDROID)) {
      return UserAgentParser.OS_NAME_ANDROID
    }
    if (userAgent.includes(UserAgentParser.OS_TOKEN_LINUX)) {
      return UserAgentParser.OS_NAME_LINUX
    }
    if (userAgent.includes(UserAgentParser.OS_TOKEN_CHROME_OS)) {
      return UserAgentParser.OS_NAME_CHROME_OS
    }
    return UserAgentParser.OS_NAME_UNKNOWN
  }
}
