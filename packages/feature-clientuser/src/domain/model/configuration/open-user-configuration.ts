import type { OpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { toOpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { toOpenGlobalSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { OpenGlobalSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { toOpenSecuritySettings } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenSecuritySettings } from '@mudrichenkoevgeny/web-platform-sdk-core-security'

/**
 * Domain model representing the bundled open user configuration.
 */
export interface OpenUserConfiguration {
  readonly openGlobalSettings: OpenGlobalSettings
  readonly openSecuritySettings: OpenSecuritySettings
  readonly openAuthSettings: OpenAuthSettings
}

/**
 * Maps an {@link OpenUserConfigurationPayload} into an {@link OpenUserConfiguration} domain model.
 *
 * @param payload - Raw API payload response
 * @returns Mapped domain model
 */
export const toOpenUserConfiguration = (payload: OpenUserConfigurationPayload): OpenUserConfiguration => ({
  openGlobalSettings: toOpenGlobalSettings(payload.open_global_settings),
  openSecuritySettings: toOpenSecuritySettings(payload.open_security_settings),
  openAuthSettings: toOpenAuthSettings(payload.open_auth_settings)
})
