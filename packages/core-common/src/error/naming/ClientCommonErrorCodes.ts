/**
 * Common client-side error code constants.
 */
export const ClientCommonErrorCodes = {
  /** Error code indicating no internet connection available on client device. */
  NO_INTERNET_CONNECTION: 'NO_INTERNET_CONNECTION',
  /** Error code indicating generic network transport failure. */
  NETWORK: 'NETWORK',
  /** Error code indicating response payload contract violation. */
  CONTRACT_VIOLATION: 'CONTRACT_VIOLATION',
  /** Error code indicating component lifecycle state error. */
  LIFECYCLE_ERROR: 'LIFECYCLE_ERROR'
} as const
