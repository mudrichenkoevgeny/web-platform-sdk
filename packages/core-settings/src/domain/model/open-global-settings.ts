import type { OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Domain model representing open global platform settings.
 */
export interface OpenGlobalSettings {
  /** URL for the platform privacy policy. */
  readonly privacyPolicyUrl: string | null
  /** URL for the platform terms of service. */
  readonly termsOfServiceUrl: string | null
  /** Support contact email address. */
  readonly contactSupportEmail: string | null
  /** Map of client platform string to its minimum supported version. */
  readonly minSupportedAppVersions: Record<string, string>
}

/**
 * Maps an {@link OpenGlobalSettingsPayload} server response object into an {@link OpenGlobalSettings} domain model.
 *
 * @param payload - Raw API response payload
 * @returns Mapped domain model
 */
export const toOpenGlobalSettings = (payload: OpenGlobalSettingsPayload): OpenGlobalSettings => ({
  privacyPolicyUrl: payload.privacy_policy_url,
  termsOfServiceUrl: payload.terms_of_service_url,
  contactSupportEmail: payload.contact_support_email,
  minSupportedAppVersions: { ...payload.min_supported_app_versions }
})

/**
 * Maps an {@link OpenGlobalSettings} domain model into an {@link OpenGlobalSettingsPayload} server payload.
 *
 * @param settings - Global settings domain model
 * @returns Serialized API payload
 */
export const toOpenGlobalSettingsPayload = (settings: OpenGlobalSettings): OpenGlobalSettingsPayload => ({
  privacy_policy_url: settings.privacyPolicyUrl,
  terms_of_service_url: settings.termsOfServiceUrl,
  contact_support_email: settings.contactSupportEmail,
  min_supported_app_versions: { ...settings.minSupportedAppVersions }
})
