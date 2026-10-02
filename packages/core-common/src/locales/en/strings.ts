export interface CoreCommonStrings {
  error_common_not_found: string
  error_common_not_found_args: (resource: string) => string
  error_common_missing_parameter: string
  error_common_missing_parameter_args: (param: string) => string
  error_common_invalid_parameter: string
  error_common_invalid_parameter_args: (param: string) => string
  error_common_missing_field: string
  error_common_missing_field_args: (field: string) => string
  error_common_blank_field: string
  error_common_blank_field_args: (field: string) => string
  error_common_empty_field: string
  error_common_empty_field_args: (collection: string) => string
  error_common_invalid_field: string
  error_common_invalid_field_args: (field: string) => string
  error_common_too_many_requests: string
  error_common_too_many_requests_args: (seconds: string | number) => string
  error_common_service_unavailable: string
  error_common_internal: string
  error_common_unknown: string
  error_common_no_internet: string
  error_common_network: string

  retry: string
  ui_common_yes: string
  ui_common_no: string
  ui_common_sort_asc: string
  ui_common_sort_desc: string
  ui_common_select_all: string
  ui_common_clear_all: string
  ui_common_search_placeholder: string
  ui_common_all: string
  ui_common_selected_count: (count: number) => string
  ui_common_apply: string
  ui_common_created_at: string
  ui_common_status: string
  ui_common_action: string
  ui_common_resource: string
  ui_common_message: string
  ui_common_role: string
  ui_common_actor_type: string
  ui_common_user: string
  ui_common_system: string
  ui_common_service: string
  ui_common_success: string
  ui_common_failed: string
  ui_common_denied: string
  ui_common_email: string
  ui_common_phone: string
  ui_common_google: string
  ui_common_android: string
  ui_common_ios: string
  ui_common_web: string
  ui_common_desktop: string
  ui_common_staff: string
  ui_common_admin: string
  ui_common_active: string
  ui_common_read_only: string
  ui_common_banned: string
  ui_common_security_hold: string
  ui_common_pending_deletion: string
  ui_common_totp_enabled: string
  ui_common_authority_level_from: string
  ui_common_authority_level_to: string
  ui_common_ip_address: string
  ui_common_user_agent: string
  ui_common_device_name: string
  ui_common_identifier: string
  ui_common_client_type: string
  ui_common_auth_provider: string
  ui_common_lockout_type: string
  ui_common_lockout_until: string
  ui_common_lockout_none: string
  ui_common_lockout_indefinite: string
  ui_common_lockout_temporary: string
  ui_common_apple: string
  ui_common_updated_at: string
  ui_common_last_accessed_at: string
  ui_common_last_reauthenticated_at: string
  ui_common_expires_at: string
  ui_common_user_id: string
  ui_common_identifier_id: string
  ui_common_language: string
  ui_common_device_id: string
  ui_common_app_version: string
  ui_common_os_version: string
  ui_common_total_count: (count: number) => string
  ui_common_page_info: (page: number, totalPages: number) => string
  ui_common_empty_list: string
  ui_common_last_login_at: string
  ui_common_last_active_at: string
  ui_common_scheduled_permanent_deletion_at: string
  ui_common_actor_id: string
  ui_common_resource_id: string
}

export const enStrings: CoreCommonStrings = {
  error_common_not_found: 'Resource not found.',
  error_common_not_found_args: (resource: string) => `Resource "${resource}" was not found.`,
  error_common_missing_parameter: 'A required parameter is missing.',
  error_common_missing_parameter_args: (param: string) => `The required parameter "${param}" is missing.`,
  error_common_invalid_parameter: 'A parameter has an invalid value.',
  error_common_invalid_parameter_args: (param: string) => `The parameter "${param}" has an invalid value.`,
  error_common_missing_field: 'A required field is missing.',
  error_common_missing_field_args: (field: string) => `The required field "${field}" is missing.`,
  error_common_blank_field: 'The field must not be blank.',
  error_common_blank_field_args: (field: string) => `The field "${field}" must not be blank.`,
  error_common_empty_field: 'The field must not be empty.',
  error_common_empty_field_args: (collection: string) => `The collection "${collection}" must not be empty.`,
  error_common_invalid_field: 'The field has an invalid value.',
  error_common_invalid_field_args: (field: string) => `The field "${field}" has an invalid value.`,
  error_common_too_many_requests: 'Too many requests. Please try again later.',
  error_common_too_many_requests_args: (seconds: string | number) => `Too many requests. Try again in ${seconds} seconds.`,
  error_common_service_unavailable: 'The service is temporarily unavailable.',
  error_common_internal: 'An error has occurred.',
  error_common_unknown: 'An unknown error has occurred.',
  error_common_no_internet: 'No internet connection.',
  error_common_network: 'Network error.',

  retry: 'Retry',
  ui_common_yes: 'Yes',
  ui_common_no: 'No',
  ui_common_sort_asc: 'Asc',
  ui_common_sort_desc: 'Desc',
  ui_common_select_all: 'Select all',
  ui_common_clear_all: 'Clear all',
  ui_common_search_placeholder: 'Search...',
  ui_common_all: 'All',
  ui_common_selected_count: (count: number) => `Selected: ${count}`,
  ui_common_apply: 'Apply',
  ui_common_created_at: 'Created Date',
  ui_common_status: 'Status',
  ui_common_action: 'Action',
  ui_common_resource: 'Resource',
  ui_common_message: 'Message',
  ui_common_role: 'User Role',
  ui_common_actor_type: 'Actor Type',
  ui_common_user: 'User',
  ui_common_system: 'System',
  ui_common_service: 'Service',
  ui_common_success: 'Success',
  ui_common_failed: 'Failed',
  ui_common_denied: 'Denied',
  ui_common_email: 'Email',
  ui_common_phone: 'Phone',
  ui_common_google: 'Google',
  ui_common_android: 'Android',
  ui_common_ios: 'iOS',
  ui_common_web: 'Web',
  ui_common_desktop: 'Desktop',
  ui_common_staff: 'Staff',
  ui_common_admin: 'Admin',
  ui_common_active: 'Active',
  ui_common_read_only: 'Read Only',
  ui_common_banned: 'Banned',
  ui_common_security_hold: 'Security Hold',
  ui_common_pending_deletion: 'Pending Deletion',
  ui_common_totp_enabled: 'TOTP Enabled',
  ui_common_authority_level_from: 'Authority Level From',
  ui_common_authority_level_to: 'Authority Level To',
  ui_common_ip_address: 'IP Address',
  ui_common_user_agent: 'User Agent',
  ui_common_device_name: 'Device Name',
  ui_common_identifier: 'Identifier',
  ui_common_client_type: 'Client Type',
  ui_common_auth_provider: 'Auth Provider',
  ui_common_lockout_type: 'Lockout Type',
  ui_common_lockout_until: 'Lockout Until',
  ui_common_lockout_none: 'None',
  ui_common_lockout_indefinite: 'Indefinite',
  ui_common_lockout_temporary: 'Temporary',
  ui_common_apple: 'Apple',
  ui_common_updated_at: 'Updated Date',
  ui_common_last_accessed_at: 'Last Accessed Date',
  ui_common_last_reauthenticated_at: 'Last Reauthenticated Date',
  ui_common_expires_at: 'Expiration Date',
  ui_common_user_id: 'User ID',
  ui_common_identifier_id: 'Credential ID',
  ui_common_language: 'Language',
  ui_common_device_id: 'Device ID',
  ui_common_app_version: 'App Version',
  ui_common_os_version: 'OS Version',
  ui_common_total_count: (count: number) => `Total: ${count}`,
  ui_common_page_info: (page: number, totalPages: number) => `Page ${page} of ${totalPages}`,
  ui_common_empty_list: 'No items found',
  ui_common_last_login_at: 'Last Login Date',
  ui_common_last_active_at: 'Last Active Date',
  ui_common_scheduled_permanent_deletion_at: 'Scheduled Deletion Date',
  ui_common_actor_id: 'Actor ID',
  ui_common_resource_id: 'Resource ID'
}
