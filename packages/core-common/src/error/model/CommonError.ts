import { CommonErrorCodes, CommonErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { AppError } from './AppError'
import { ErrorId, generateErrorId } from './ErrorId'
import { ClientCommonErrorCodes } from '../naming/ClientCommonErrorCodes'

export abstract class CommonError implements AppError {
  public constructor(
    public readonly id: ErrorId,
    public readonly code: string,
    public readonly args: Record<string, string> | null = null,
    public readonly isRetryable: boolean = false
  ) {}

  public static unknown(isRetryable: boolean = false): CommonErrorUnknown {
    return new CommonErrorUnknown(isRetryable)
  }

  public static internal(throwable: unknown, isRetryable: boolean = false): CommonErrorInternal {
    return new CommonErrorInternal(throwable, isRetryable)
  }

  public static noInternetConnection(throwable: unknown, isRetryable: boolean = true): CommonErrorNoInternetConnection {
    return new CommonErrorNoInternetConnection(throwable, isRetryable)
  }

  public static network(throwable: unknown, isRetryable: boolean = true): CommonErrorNetwork {
    return new CommonErrorNetwork(throwable, isRetryable)
  }

  public static contractViolation(throwable?: unknown, args?: Record<string, string> | null, isRetryable: boolean = false): CommonErrorContractViolation {
    return new CommonErrorContractViolation(throwable, args, isRetryable)
  }

  public static lifecycle(message: string, isRetryable: boolean = false): CommonErrorLifecycle {
    return new CommonErrorLifecycle(message, isRetryable)
  }
}

export class CommonErrorUnknown extends CommonError {
  public constructor(isRetryable: boolean = false) {
    super(generateErrorId(), CommonErrorCodes.UNKNOWN, null, isRetryable)
  }
}

export class CommonErrorInternal extends CommonError {
  public constructor(public readonly throwable: unknown, isRetryable: boolean = false) {
    super(generateErrorId(), CommonErrorCodes.INTERNAL, null, isRetryable)
  }
}

export class CommonErrorNoInternetConnection extends CommonError {
  public constructor(public readonly throwable: unknown, isRetryable: boolean = true) {
    super(generateErrorId(), ClientCommonErrorCodes.NO_INTERNET_CONNECTION, null, isRetryable)
  }
}

export class CommonErrorNetwork extends CommonError {
  public constructor(public readonly throwable: unknown, isRetryable: boolean = true) {
    super(generateErrorId(), ClientCommonErrorCodes.NETWORK, null, isRetryable)
  }
}

export class CommonErrorContractViolation extends CommonError {
  public constructor(
    public readonly throwable?: unknown,
    args?: Record<string, string> | null,
    isRetryable: boolean = false
  ) {
    super(generateErrorId(), ClientCommonErrorCodes.CONTRACT_VIOLATION, args ?? null, isRetryable)
  }
}

export class CommonErrorLifecycle extends CommonError {
  public constructor(message: string, isRetryable: boolean = false) {
    super(generateErrorId(), ClientCommonErrorCodes.LIFECYCLE_ERROR, { [CommonErrorArgs.MESSAGE]: message }, isRetryable)
  }
}
