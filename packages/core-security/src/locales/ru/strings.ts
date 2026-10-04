import type { CoreSecurityStrings } from '@/en/strings'

export const ruSecurityStrings: CoreSecurityStrings = {
  error_security_mfa_confirmation_required: 'Требуется подтверждение аутентификации.',
  error_security_mfa_confirmation_required_args: (mfaToken: string) => `Требуется подтверждение аутентификации. Токен MFA: ${mfaToken}`,
  error_security_totp_already_enabled: 'Двухфакторная аутентификация уже включена для этого аккаунта.',
  error_security_totp_not_enabled: 'Двухфакторная аутентификация не включена для этого аккаунта.',
  error_security_mfa_token_expired: 'Срок действия токена MFA истек. Запросите новый.',
  error_security_invalid_mfa_token: 'Токен MFA недействителен.',
  error_security_invalid_totp_code: 'Указанный код недействителен.',
  error_security_recovery_code_used: 'Этот код восстановления уже был использован.',
  error_security_otp_retry_too_soon: 'Слишком много попыток. Пожалуйста, попробуйте позже.',
  error_security_otp_retry_too_soon_args: (seconds: string | number) => `Слишком много попыток. Повторите через ${seconds} сек.`,
  error_security_password_too_weak: 'Пароль слишком слабый.',
  error_security_password_too_weak_args: (
    tooShort: boolean | string,
    minLength: string | number,
    noLetters: boolean | string,
    noUppercase: boolean | string,
    noLowercase: boolean | string,
    noDigits: boolean | string,
    noSpecialChars: boolean | string,
    tooCommon: boolean | string
  ) => `Пароль слишком слабый. Слишком короткий: ${tooShort} (мин: ${minLength}), Нет букв: ${noLetters}, Нет заглавных: ${noUppercase}, Нет строчных: ${noLowercase}, Нет цифр: ${noDigits}, Нет спецсимволов: ${noSpecialChars}, Слишком распространенный: ${tooCommon}.`,
  error_security_password_policy_unavailable: 'Не удалось загрузить требования к паролю.',
  error_security_password_too_short: 'Пароль слишком короткий.',
  error_security_password_too_short_args: (minLength: string | number) => `Пароль должен содержать не менее ${minLength} символов.`,
  error_security_password_no_letter: 'Пароль должен содержать хотя бы одну букву.',
  error_security_password_no_uppercase: 'Пароль должен содержать хотя бы одну заглавную букву.',
  error_security_password_no_lowercase: 'Пароль должен содержать хотя бы одну строчную букву.',
  error_security_password_no_digit: 'Пароль должен содержать хотя бы одну цифру.',
  error_security_password_no_special_char: 'Пароль должен содержать хотя бы один специальный символ.',
  error_security_password_too_common: 'Пароль слишком распространен и ненадежен.',
  error_security_ip_not_allowed: 'Запрос отклонен, так как IP-адрес не разрешен политикой безопасности.'
}
