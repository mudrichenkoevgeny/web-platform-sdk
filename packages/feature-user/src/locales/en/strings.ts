import type { CoreCommonStrings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enStrings as enCoreCommonStrings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/** Localized string dictionary contract for feature-user. */
export interface FeatureUserStrings extends CoreCommonStrings {
  readonly error_user_invalid_access_token: string
  readonly error_user_access_token_expired: string
  readonly error_user_invalid_refresh_token: string
  readonly error_user_invalid_session: string
  readonly error_user_banned: string
  readonly error_user_locked: string
  readonly error_user_locked_until: (formattedUntil: string) => string
  readonly error_user_self_service_unlock_disabled: string
  readonly error_user_read_only: string
  readonly error_user_security_hold: string
  readonly error_user_pending_deletion: string
  readonly error_user_illegal_status: string
  readonly error_user_forbidden: string
  readonly error_user_role_not_allowed: string
  readonly error_user_missing_permissions: string
  readonly error_user_insufficient_authority: string
  readonly error_user_not_found: string
  readonly error_user_invalid_credentials: string
  readonly error_user_wrong_password: string
  readonly error_user_password_setup_required: string
  readonly error_user_identifier_password_not_supported: string
  readonly error_user_identifier_password_not_set: string
  readonly error_user_wrong_confirmation_code: string
  readonly error_user_external_linkage_failed: string
  readonly error_user_can_not_delete_identifier: string
  readonly error_user_can_not_create_identifier: string
  readonly error_user_identifier_limit_reached: string
  readonly error_user_identifier_limit_reached_args: (limit: string | number, provider: string) => string
  readonly error_user_total_identifiers_limit_reached: string
  readonly error_user_total_identifiers_limit_reached_args: (limit: string | number) => string
  readonly error_user_email_not_allowed: string

  readonly login: string
  readonly login_with: string
  readonly sign_in: string
  readonly sign_in_with_email: string
  readonly sign_in_with_phone: string
  readonly sign_in_with_google: string
  readonly sign_in_with_apple: string
  readonly or_sign_in_with: string
  readonly email: string
  readonly phone_number: string

  readonly enter_phone_number: string
  readonly send_code: string

  readonly enter_confirmation_code: string
  readonly code_sent_to: (target: string) => string
  readonly confirmation_code: string
  readonly resend_code_timer: (seconds: number | string) => string
  readonly resend_code: string
  readonly change_phone_number: string
  readonly confirm: string

  readonly login_by_email: string
  readonly login_by_totp: string
  readonly login_by_recovery_code: string
  readonly login_by_totp_desc: (digits: number | string) => string
  readonly login_by_recovery_code_desc: string
  readonly totp_code: string
  readonly recovery_code: string
  readonly use_recovery_code: string
  readonly use_totp: string
  readonly password: string

  readonly profile: string
  readonly logout: string
  readonly totp_main: string
  readonly sessions: string
  readonly identifiers: string
  readonly session_revoke: string
  readonly session_revoke_all_others: string
  readonly session_current: string
  readonly session_expires_at: (date: string) => string
  readonly session_last_accessed: (date: string) => string
  readonly session_ip_address: (ip: string) => string
  readonly session_detail_title_session: string
  readonly session_detail_title_current_session: string
  readonly session_detail_auth_provider: string
  readonly session_detail_device_info: string
  readonly session_detail_device_name: string
  readonly session_detail_client_type: string
  readonly session_detail_language: string
  readonly session_detail_app_version: string
  readonly session_detail_os_version: string
  readonly session_detail_ip_address_label: string
  readonly session_detail_last_accessed_label: string
  readonly session_detail_created_at_label: string
  readonly not_available: string

  readonly identifier_delete: string
  readonly identifier_add_email: string
  readonly identifier_add_phone: string
  readonly identifier_add_google: string
  readonly identifier_add_apple: string
  readonly identifier_primary: string
  readonly delete_account: string
  readonly not_authorized: string
  readonly user_id: (id: string) => string
  readonly account_status_prefix: (status: string) => string
  readonly account_status_active: string
  readonly account_status_read_only: string
  readonly account_status_banned: string
  readonly account_status_security_hold: string
  readonly account_status_pending_deletion: string
  readonly authority_level_prefix: (level: number | string) => string
  readonly permission_codes_prefix: (perms: string) => string
  readonly permissions_none: string

  readonly totp_disabled_desc: string
  readonly setup_totp: string
  readonly totp_setup_step1: string
  readonly totp_setup_step1_desc: string
  readonly totp_manual_key: string
  readonly totp_setup_step2: string
  readonly totp_setup_step2_desc: string
  readonly totp_enabled_title: string
  readonly totp_enabled_desc: string
  readonly recovery_codes_title: string
  readonly recovery_codes_desc: string
  readonly regenerate_recovery_codes: string
  readonly disable_totp: string
  readonly copy_all: string

  readonly dialog_confirm_title: string
  readonly dialog_cancel: string
  readonly dialog_confirm: string

  readonly delete_account_confirm_msg: string
  readonly logout_confirm_msg: string
  readonly disable_totp_confirm_msg: string
  readonly regenerate_codes_confirm_msg: string

  readonly account_pending_deletion_title: string
  readonly account_pending_deletion_desc: string
  readonly restore_account: string

  readonly change_password: string
  readonly old_password: string
  readonly new_password: string

  readonly forgot_password: string
  readonly no_account_register: string

  readonly registration_by_email: string
  readonly register: string

  readonly reset_password: string
  readonly change_email: string

  readonly legal_agreement_prefix: string
  readonly and: string
  readonly privacy_policy: string
  readonly terms_of_service: string
  readonly email_prefix: (email: string) => string
  readonly phone_prefix: (phone: string) => string
  readonly cancel: string
  readonly error_user_registration_disabled: string

  readonly account_locked_title: string
  readonly account_locked_desc: string
  readonly unlock_account: string
  readonly unlock_by_email: string
  readonly unlock_by_phone: string
  readonly unlock_by_google: string
  readonly unlock_by_apple: string
  readonly unlock_choose_method: string
  readonly unlock_email_input_desc: string
  readonly unlock_phone_input_desc: string
  readonly unlock_success_title: string
  readonly unlock_success_desc: string
  readonly mfa_step_up_title: string
  readonly mfa_step_up_desc: string

  readonly identifier_detail_title: string
  readonly identifier_detail_title_current: string
  readonly identifier_detail_id: string
  readonly identifier_detail_value: string
  readonly identifier_detail_auth_provider: string
  readonly identifier_detail_external_email: string
  readonly identifier_detail_created_at: string
  readonly identifier_detail_updated_at: string
  readonly identifier_delete_button: string
  readonly identifier_delete_password_button: string
  readonly add_identifier: string
  readonly user_label: string
}

export const enUserStrings: FeatureUserStrings = {
  ...enCoreCommonStrings,

  error_user_invalid_access_token: 'The access token is invalid.',
  error_user_access_token_expired: 'The access token has expired.',
  error_user_invalid_refresh_token: 'The refresh token is invalid.',
  error_user_invalid_session: 'The session is invalid.',
  error_user_banned: 'This account has been banned.',
  error_user_locked: 'This account has been locked.',
  error_user_locked_until: (formattedUntil: string) => `This account has been locked until ${formattedUntil}.`,
  error_user_self_service_unlock_disabled: 'Self-service account unlock is currently disabled.',
  error_user_read_only: 'This account is read-only.',
  error_user_security_hold: 'This account is temporarily restricted for security reasons.',
  error_user_pending_deletion: 'This account is pending deletion and cannot be used.',
  error_user_illegal_status: 'The current account status does not allow this operation.',
  error_user_forbidden: 'Access to this resource is forbidden.',
  error_user_role_not_allowed: 'Your role does not allow this action.',
  error_user_missing_permissions: 'You do not have the required permissions for this action.',
  error_user_insufficient_authority: 'Your authority level is insufficient for this action.',
  error_user_not_found: 'User not found.',
  error_user_invalid_credentials: 'Invalid email or password.',
  error_user_wrong_password: 'The current password is incorrect.',
  error_user_password_setup_required: 'Password setup is required for this account.',
  error_user_identifier_password_not_supported: 'Passwords are not supported for this identification method.',
  error_user_identifier_password_not_set: 'A password has not been set for this identification method.',
  error_user_wrong_confirmation_code: 'The confirmation code is incorrect or has expired.',
  error_user_external_linkage_failed: 'External account could not be linked.',
  error_user_can_not_delete_identifier: 'This sign-in method cannot be removed.',
  error_user_can_not_create_identifier: 'This sign-in method could not be added.',
  error_user_identifier_limit_reached: 'The limit of identifiers has been reached.',
  error_user_identifier_limit_reached_args: (limit: string | number, provider: string) => `The limit of ${limit} identifiers for "${provider}" has been reached.`,
  error_user_total_identifiers_limit_reached: 'The maximum total limit of identifiers has been reached.',
  error_user_total_identifiers_limit_reached_args: (limit: string | number) => `The maximum total limit of ${limit} identifiers per account has been reached.`,
  error_user_email_not_allowed: 'The email address or domain is not permitted by restriction policy.',

  login: 'Login',
  login_with: 'Login with:',
  sign_in: 'Sign In',
  sign_in_with_email: 'Sign in with Email',
  sign_in_with_phone: 'Sign in with Phone',
  sign_in_with_google: 'Sign in with Google',
  sign_in_with_apple: 'Sign in with Apple',
  or_sign_in_with: 'Or sign in with',
  email: 'Email',
  phone_number: 'Phone number',

  enter_phone_number: 'Enter phone number',
  send_code: 'Send code',

  enter_confirmation_code: 'Enter code',
  code_sent_to: (target: string) => `The code has been sent to ${target}`,
  confirmation_code: 'Confirmation code',
  resend_code_timer: (seconds: number | string) => `Resend code in ${seconds} sec`,
  resend_code: 'Resend code',
  change_phone_number: 'Change phone number',
  confirm: 'Confirm',

  login_by_email: 'Login by Email',
  login_by_totp: 'Login by TOTP',
  login_by_recovery_code: 'Login by Recovery Code',
  login_by_totp_desc: (digits: number | string) => `Two-factor authentication is active on your account. Enter the ${digits}-digit code from your authenticator app.`,
  login_by_recovery_code_desc: 'Enter one of your single-use backup recovery codes. Note: the used recovery code will become invalid immediately upon sign-in.',
  totp_code: 'TOTP Code',
  recovery_code: 'Recovery Code',
  use_recovery_code: 'Use recovery code',
  use_totp: 'Use TOTP',
  password: 'Password',

  profile: 'Profile',
  logout: 'Logout',
  totp_main: 'TOTP',
  sessions: 'Sessions',
  identifiers: 'Identifiers',
  session_revoke: 'Revoke',
  session_revoke_all_others: 'Revoke all other sessions',
  session_current: 'This device',
  session_expires_at: (date: string) => `Expires at: ${date}`,
  session_last_accessed: (date: string) => `Last accessed: ${date}`,
  session_ip_address: (ip: string) => `IP: ${ip}`,
  session_detail_title_session: 'Session',
  session_detail_title_current_session: 'Current Session',
  session_detail_auth_provider: 'Auth Provider',
  session_detail_device_info: 'Device Information',
  session_detail_device_name: 'Device Name',
  session_detail_client_type: 'Client Type',
  session_detail_language: 'Language',
  session_detail_app_version: 'App Version',
  session_detail_os_version: 'OS Version',
  session_detail_ip_address_label: 'IP Address',
  session_detail_last_accessed_label: 'Last Accessed',
  session_detail_created_at_label: 'Created At',
  not_available: 'N/A',

  identifier_delete: 'Delete',
  identifier_add_email: 'Add Email',
  identifier_add_phone: 'Add Phone',
  identifier_add_google: 'Add Google',
  identifier_add_apple: 'Add Apple',
  identifier_primary: 'Primary',
  delete_account: 'Delete Account',
  not_authorized: 'Not authorized!',
  user_id: (id: string) => `User ID: ${id}`,
  account_status_prefix: (status: string) => `Account status: ${status}`,
  account_status_active: 'Active',
  account_status_read_only: 'Read-only',
  account_status_banned: 'Banned',
  account_status_security_hold: 'Security hold',
  account_status_pending_deletion: 'Pending deletion',
  authority_level_prefix: (level: number | string) => `Authority level: ${level}`,
  permission_codes_prefix: (perms: string) => `Permissions: ${perms}`,
  permissions_none: 'None',

  totp_disabled_desc: 'Two-factor authentication (TOTP) adds an extra layer of security to your account. When enabled, you will need to enter a code from your authenticator app to sign in.',
  setup_totp: 'Set up TOTP',
  totp_setup_step1: 'Step 1: Link your app',
  totp_setup_step1_desc: 'Open your authenticator app (like Google Authenticator or Authy) and enter the following key manually.',
  totp_manual_key: 'Manual Entry Key:',
  totp_setup_step2: 'Step 2: Verify code',
  totp_setup_step2_desc: 'Enter the 6-digit code generated by your app to confirm setup.',
  totp_enabled_title: 'Two-factor authentication is active',
  totp_enabled_desc: 'Two-factor authentication is currently enabled for your account. You can view your recovery codes or disable two-factor authentication below.',
  recovery_codes_title: 'Recovery Codes',
  recovery_codes_desc: 'Keep these codes in a safe place. They can be used to access your account if you lose your device.',
  regenerate_recovery_codes: 'Regenerate codes',
  disable_totp: 'Disable TOTP',
  copy_all: 'Copy all',

  dialog_confirm_title: 'Are you sure?',
  dialog_cancel: 'Cancel',
  dialog_confirm: 'Confirm',

  delete_account_confirm_msg: 'This will permanently schedule your account for deletion. This action can be undone only within a limited time.',
  logout_confirm_msg: 'Are you sure you want to log out of your account?',
  disable_totp_confirm_msg: 'Disabling two-factor authentication will make your account less secure. Are you sure you want to proceed?',
  regenerate_codes_confirm_msg: 'Regenerating recovery codes will invalidate all your current backup codes. Make sure to save the new ones immediately.',

  account_pending_deletion_title: 'Account Scheduled for Deletion',
  account_pending_deletion_desc: 'Your account is currently scheduled for permanent deletion. You can restore it to continue using the application.',
  restore_account: 'Restore account',

  change_password: 'Change password',
  old_password: 'Current password',
  new_password: 'New password',

  forgot_password: 'Forgot password?',
  no_account_register: "Don't have an account? Register",

  registration_by_email: 'Registration by Email',
  register: 'Register',

  reset_password: 'Reset password',
  change_email: 'Change email',

  legal_agreement_prefix: 'By signing in, you agree to our',
  and: 'and',
  privacy_policy: 'Privacy Policy',
  terms_of_service: 'Terms of service',
  email_prefix: (email: string) => `Email: ${email}`,
  phone_prefix: (phone: string) => `Phone: ${phone}`,
  cancel: 'Cancel',
  error_user_registration_disabled: 'Registration is currently disabled',

  account_locked_title: 'Account Temporarily Locked',
  account_locked_desc: 'Your account has been locked due to security policy or multiple failed login attempts. You can unlock it using one of your verified identification methods.',
  unlock_account: 'Unlock account',
  unlock_by_email: 'Unlock via Email',
  unlock_by_phone: 'Unlock via SMS',
  unlock_by_google: 'Unlock via Google',
  unlock_by_apple: 'Unlock via Apple',
  unlock_choose_method: 'Choose unlock method',
  unlock_email_input_desc: 'Enter your email address to receive an account unlock code.',
  unlock_phone_input_desc: 'Enter your phone number to receive an account unlock SMS code.',
  unlock_success_title: 'Account Successfully Unlocked',
  unlock_success_desc: 'Your account has been unlocked. You may now continue using all services.',
  mfa_step_up_title: 'Security Confirmation',
  mfa_step_up_desc: 'This operation requires additional verification. Enter the 6-digit code from your authenticator app.',

  identifier_detail_title: 'Identifier',
  identifier_detail_title_current: 'Current Identifier',
  identifier_detail_id: 'Identifier ID',
  identifier_detail_value: 'Identifier Value',
  identifier_detail_auth_provider: 'Auth Provider',
  identifier_detail_external_email: 'External Email',
  identifier_detail_created_at: 'Created At',
  identifier_detail_updated_at: 'Updated At',
  identifier_delete_button: 'Delete Identifier',
  identifier_delete_password_button: 'Delete Password',
  add_identifier: 'Add Identifier',
  user_label: 'User'
}
