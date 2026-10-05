import type { FeatureUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { enUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export interface FeatureManagementUserStrings extends FeatureUserStrings {
  readonly management_settings_title: string
  readonly audit_logs: string
  readonly filter: string
  readonly refresh: string
  readonly retry: string

  readonly audit_logs_title: string
  readonly audit_event_details_title: string
  readonly audit_event_id: string
  readonly audit_event_action: string
  readonly audit_event_resource: string
  readonly audit_event_resource_id: string
  readonly audit_event_resource_sensitivity: string
  readonly audit_event_status: string
  readonly audit_event_actor: string
  readonly audit_event_actor_type: string
  readonly audit_event_actor_role: string
  readonly audit_event_message: string
  readonly audit_event_timestamp: string
  readonly audit_event_metadata: string

  readonly edit_auth_settings_title: string
  readonly enabled_auth_providers: string
  readonly is_registration_enabled: string
  readonly limits_and_expirations: string
  readonly max_total_identifiers: string
  readonly max_email_identifiers: string
  readonly max_phone_identifiers: string
  readonly max_identifiers_per_external_provider: string
  readonly max_active_sessions: string
  readonly max_active_sessions_open: string
  readonly max_active_sessions_management: string
  readonly access_token_expiration_seconds: string
  readonly refresh_token_expiration_seconds: string
  readonly account_deletion_delay_seconds: string
  readonly account_deletion_check_interval_seconds: string
  readonly open_email_restriction_policy: string
  readonly management_email_restriction_policy: string
  readonly blacklist_enabled: string
  readonly whitelist_enabled: string
  readonly email_blacklist_placeholder: string
  readonly email_whitelist_placeholder: string
  readonly blacklist_placeholder: string
  readonly whitelist_placeholder: string

  readonly edit_global_settings: string
  readonly edit_auth_settings: string
  readonly edit_security_settings: string
  readonly users_management: string

  readonly users_management_title: string
  readonly create_user: string
  readonly create_user_title: string
  readonly save: string
  readonly saving: string
  readonly reset_to_defaults: string
  readonly user_details_title: string
  readonly update_user: string
  readonly delete_user: string
  readonly delete_user_confirmation_desc: string
  readonly user_id: (id: string) => string
  readonly user_role: string
  readonly user_account_status: string
  readonly authority_level: string
  readonly user_sessions: string
  readonly user_identifiers: string
  readonly disable_totp: string
  readonly disabling_totp: string
  readonly revoke_all_sessions: string
  readonly error_authority_level_too_high: (level: number | string) => string
  readonly error_role_too_high: string

  readonly edit_global_settings_title: string
  readonly privacy_policy_url: string
  readonly terms_of_service_url: string
  readonly contact_support_email: string
  readonly telemetry_and_logging: string
  readonly is_tracing_enabled: string
  readonly is_metrics_enabled: string
  readonly is_verbose_logging_enabled: string
  readonly min_supported_app_versions: string
  readonly min_version_android: string
  readonly min_version_ios: string
  readonly min_version_web: string
  readonly min_version_desktop: string

  readonly edit_security_settings_title: string
  readonly general_security: string
  readonly recent_authentication_validity_seconds: string
  readonly recent_authentication_validity_for_management: string
  readonly mfa_token_expiration_seconds: string
  readonly refresh_token_rotation_grace_period_seconds: string
  readonly rate_limiting: string
  readonly max_requests_per_period: string
  readonly rate_limit_period_seconds: string
  readonly password_policy: string
  readonly password_min_length: string
  readonly password_require_letter: string
  readonly password_require_uppercase: string
  readonly password_require_lowercase: string
  readonly password_require_digit: string
  readonly password_require_special_char: string
  readonly common_passwords_placeholder: string
  readonly account_lockout_policy_section: string
  readonly max_failed_password_attempts: string
  readonly max_failed_otp_attempts: string
  readonly max_failed_totp_attempts: string
  readonly failed_attempts_window_seconds: string
  readonly lockout_duration_seconds: string
  readonly indefinite_lockout_threshold: string
  readonly self_service_unlock_enabled: string
  readonly account_lockout_check_interval_seconds: string
  readonly open_ip_restriction_policy: string
  readonly management_ip_restriction_policy: string
  readonly otp_confirmation: string
  readonly otp_retry_after_seconds: string
  readonly otp_number_of_symbols: string
  readonly otp_expiration_seconds: string
  readonly totp_enabled_label: (enabled: string) => string
  readonly created_at_label: (date: string) => string
  readonly last_login_at_label: (date: string) => string
  readonly last_active_at_label: (date: string) => string
  readonly scheduled_deletion_at_label: (date: string) => string
}

export const enManagementUserStrings: FeatureManagementUserStrings = {
  ...enUserStrings,

  management_settings_title: 'Management Settings',
  audit_logs: 'Audit Logs',
  filter: 'Filter',
  refresh: 'Refresh',
  retry: 'Retry',

  audit_logs_title: 'Audit Logs',
  audit_event_details_title: 'Audit Event Details',
  audit_event_id: 'Event ID',
  audit_event_action: 'Action',
  audit_event_resource: 'Resource',
  audit_event_resource_id: 'Resource ID',
  audit_event_resource_sensitivity: 'Resource Sensitivity',
  audit_event_status: 'Status',
  audit_event_actor: 'Actor',
  audit_event_actor_type: 'Actor Type',
  audit_event_actor_role: 'Actor Role',
  audit_event_message: 'Message',
  audit_event_timestamp: 'Timestamp',
  audit_event_metadata: 'Metadata',

  edit_auth_settings_title: 'Edit Auth Settings',
  enabled_auth_providers: 'Enabled Auth Providers',
  is_registration_enabled: 'Allow New User Registrations',
  limits_and_expirations: 'Limits & Expirations',
  max_total_identifiers: 'Max Total Identifiers',
  max_email_identifiers: 'Max Email Identifiers',
  max_phone_identifiers: 'Max Phone Identifiers',
  max_identifiers_per_external_provider: 'Max Identifiers Per External Provider',
  max_active_sessions: 'Max Active Sessions',
  max_active_sessions_open: 'Max Active Sessions (Open User)',
  max_active_sessions_management: 'Max Active Sessions (Management User)',
  access_token_expiration_seconds: 'Access Token Expiration (seconds)',
  refresh_token_expiration_seconds: 'Refresh Token Expiration (seconds)',
  account_deletion_delay_seconds: 'Account Deletion Delay (seconds)',
  account_deletion_check_interval_seconds: 'Account Deletion Check Interval (seconds)',
  open_email_restriction_policy: 'Open Email Restriction Policy',
  management_email_restriction_policy: 'Management Email Restriction Policy',
  blacklist_enabled: 'Blacklist Enabled',
  whitelist_enabled: 'Whitelist Enabled',
  email_blacklist_placeholder: 'Blacklist (comma separated)',
  email_whitelist_placeholder: 'Whitelist (comma separated)',
  blacklist_placeholder: 'Blacklist (comma separated)',
  whitelist_placeholder: 'Whitelist (comma separated)',

  edit_global_settings: 'Edit Global Settings',
  edit_auth_settings: 'Edit Auth Settings',
  edit_security_settings: 'Edit Security Settings',
  users_management: 'Users Management',

  users_management_title: 'Users Management',
  create_user: 'Create User',
  create_user_title: 'Create User',
  save: 'Save',
  saving: 'Saving...',
  reset_to_defaults: 'Reset to defaults',
  user_details_title: 'User Details',
  update_user: 'Update User',
  delete_user: 'Delete User',
  delete_user_confirmation_desc: 'Are you sure you want to delete this user?',
  user_id: (id: string) => `User ID: ${id}`,
  user_role: 'Role',
  user_account_status: 'Status',
  authority_level: 'Authority Level',
  user_sessions: 'User Sessions',
  user_identifiers: 'User Identifiers',
  disable_totp: 'Disable TOTP',
  disabling_totp: 'Disabling TOTP...',
  revoke_all_sessions: 'Revoke All Sessions',
  error_authority_level_too_high: (level: number | string) => `Authority level must be strictly less than your authority level (${level})`,
  error_role_too_high: 'You cannot create a user with a role higher than your own',

  edit_global_settings_title: 'Edit Global Settings',
  privacy_policy_url: 'Privacy Policy URL',
  terms_of_service_url: 'Terms of Service URL',
  contact_support_email: 'Contact Support Email',
  telemetry_and_logging: 'Telemetry & Logging',
  is_tracing_enabled: 'Enable Request Tracing',
  is_metrics_enabled: 'Enable System Metrics',
  is_verbose_logging_enabled: 'Enable Verbose Logging',
  min_supported_app_versions: 'Minimum Supported App Versions',
  min_version_android: 'Android Min Version',
  min_version_ios: 'iOS Min Version',
  min_version_web: 'Web Min Version',
  min_version_desktop: 'Desktop Min Version',

  edit_security_settings_title: 'Edit Security Settings',
  general_security: 'General Security',
  recent_authentication_validity_seconds: 'Recent Auth Validity (seconds)',
  recent_authentication_validity_for_management: 'Recent Management Auth Validity (seconds)',
  mfa_token_expiration_seconds: 'MFA Token Expiration (seconds)',
  refresh_token_rotation_grace_period_seconds: 'Refresh Token Rotation Grace Period (seconds)',
  rate_limiting: 'Rate Limiting',
  max_requests_per_period: 'Max Requests Per Period',
  rate_limit_period_seconds: 'Rate Limit Period (seconds)',
  password_policy: 'Password Policy',
  password_min_length: 'Min Password Length',
  password_require_letter: 'Require Letter',
  password_require_uppercase: 'Require Uppercase',
  password_require_lowercase: 'Require Lowercase',
  password_require_digit: 'Require Digit',
  password_require_special_char: 'Require Special Character',
  common_passwords_placeholder: 'Common Passwords (comma separated)',
  account_lockout_policy_section: 'Account Lockout Policy',
  max_failed_password_attempts: 'Max Failed Password Attempts',
  max_failed_otp_attempts: 'Max Failed OTP Attempts',
  max_failed_totp_attempts: 'Max Failed TOTP Attempts',
  failed_attempts_window_seconds: 'Failed Attempts Window (seconds)',
  lockout_duration_seconds: 'Lockout Duration (seconds)',
  indefinite_lockout_threshold: 'Indefinite Lockout Threshold',
  self_service_unlock_enabled: 'Self Service Unlock Enabled',
  account_lockout_check_interval_seconds: 'Account Lockout Check Interval (seconds)',
  open_ip_restriction_policy: 'Open IP Restriction Policy',
  management_ip_restriction_policy: 'Management IP Restriction Policy',
  otp_confirmation: 'OTP Confirmation',
  otp_retry_after_seconds: 'Retry After (seconds)',
  otp_number_of_symbols: 'Number of Symbols',
  otp_expiration_seconds: 'OTP Expiration (seconds)',
  totp_enabled_label: (enabled: string) => `TOTP Enabled: ${enabled}`,
  created_at_label: (date: string) => `Created At: ${date}`,
  last_login_at_label: (date: string) => `Last Login At: ${date}`,
  last_active_at_label: (date: string) => `Last Active At: ${date}`,
  scheduled_deletion_at_label: (date: string) => `Scheduled Deletion At: ${date}`
}
