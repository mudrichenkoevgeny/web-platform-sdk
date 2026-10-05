/**
 * Standard HTTP header names injected into API requests by {@link HttpClient}.
 */
export const CommonHttpHeaders = {
  /** Trace ID header for request tracing. */
  TRACE_HEADER_NAME: 'X-Trace-Id',
  /** Client application type header. */
  CLIENT_TYPE_HEADER_NAME: 'X-Client-Type',
  /** Client device identifier header. */
  DEVICE_ID_HEADER_NAME: 'X-Device-Id',
  /** Client device model name header. */
  DEVICE_NAME_HEADER_NAME: 'X-Device-Name',
  /** Application version header. */
  APP_VERSION_HEADER_NAME: 'X-App-Version',
  /** Operating system version header. */
  OPERATION_SYSTEM_VERSION_HEADER_NAME: 'X-OS-Version'
} as const
