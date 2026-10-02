import { CommonErrorCodes, CommonErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { AppError } from './AppError'
import { ErrorId, generateErrorId } from './ErrorId'
import { ClientCommonErrorCodes } from '../naming/ClientCommonErrorCodes'

/**
 * Abstract base class for common system errors.
 */
export abstract class CommonError implements AppError {
  /**
   * Constructs a new {@link CommonError}.
   *
   * @param id - Unique error identifier
   * @param code - Error code string
   * @param args - Optional key-value parameters
   * @param isRetryable - Whether the operation is retryable
   */
  public constructor(
    public readonly id: ErrorId,
    public readonly code: string,
    public readonly args: Record<string, string> | null = null,
    public readonly isRetryable: boolean = false
  ) {}

  /**
   * Creates an unknown common error.
   *
   * @param isRetryable - Whether the error is retryable
   * @returns Instance of {@link CommonErrorUnknown}
   */
  public static unknown(isRetryable: boolean = false): CommonErrorUnknown {
    return new CommonErrorUnknown(isRetryable)
  }

  /**
   * Creates an internal system error.
   *
   * @param throwable - Underlying exception or cause
   * @param isRetryable - Whether the error is retryable
   * @returns Instance of {@link CommonErrorInternal}
   */
  public static internal(throwable: unknown, isRetryable: boolean = false): CommonErrorInternal {
    return new CommonErrorInternal(throwable, isRetryable)
  }

  /**
   * Creates a no-internet connection error.
   *
   * @param throwable - Network exception cause
   * @param isRetryable - Whether the error is retryable
   * @returns Instance of {@link CommonErrorNoInternetConnection}
   */
  public static noInternetConnection(throwable: unknown, isRetryable: boolean = true): CommonErrorNoInternetConnection {
    return new CommonErrorNoInternetConnection(throwable, isRetryable)
  }

  /**
   * Creates a generic network transport error.
   *
   * @param throwable - Transport error cause
   * @param isRetryable - Whether the error is retryable
   * @returns Instance of {@link CommonErrorNetwork}
   */
  public static network(throwable: unknown, isRetryable: boolean = true): CommonErrorNetwork {
    return new CommonErrorNetwork(throwable, isRetryable)
  }

  /**
   * Creates a contract violation error.
   *
   * @param throwable - Optional parsing or serialization exception
   * @param args - Optional arguments map
   * @param isRetryable - Whether the error is retryable
   * @returns Instance of {@link CommonErrorContractViolation}
   */
  public static contractViolation(throwable?: unknown, args?: Record<string, string> | null, isRetryable: boolean = false): CommonErrorContractViolation {
    return new CommonErrorContractViolation(throwable, args, isRetryable)
  }

  /**
   * Creates a component lifecycle error.
   *
   * @param message - Diagnostic message describing the lifecycle invalid state
   * @param isRetryable - Whether the error is retryable
   * @returns Instance of {@link CommonErrorLifecycle}
   */
  public static lifecycle(message: string, isRetryable: boolean = false): CommonErrorLifecycle {
    return new CommonErrorLifecycle(message, isRetryable)
  }
}

/** Represents an unknown system error. */
export class CommonErrorUnknown extends CommonError {
  public constructor(isRetryable: boolean = false) {
    super(generateErrorId(), CommonErrorCodes.UNKNOWN, null, isRetryable)
  }
}

/** Represents an internal unhandled system error. */
export class CommonErrorInternal extends CommonError {
  public constructor(public readonly throwable: unknown, isRetryable: boolean = false) {
    super(generateErrorId(), CommonErrorCodes.INTERNAL, null, isRetryable)
  }
}

/** Represents a missing Internet connectivity error. */
export class CommonErrorNoInternetConnection extends CommonError {
  public constructor(public readonly throwable: unknown, isRetryable: boolean = true) {
    super(generateErrorId(), ClientCommonErrorCodes.NO_INTERNET_CONNECTION, null, isRetryable)
  }
}

/** Represents a network transport error. */
export class CommonErrorNetwork extends CommonError {
  public constructor(public readonly throwable: unknown, isRetryable: boolean = true) {
    super(generateErrorId(), ClientCommonErrorCodes.NETWORK, null, isRetryable)
  }
}

/** Represents a contract schema or JSON parsing error. */
export class CommonErrorContractViolation extends CommonError {
  public constructor(
    public readonly throwable?: unknown,
    args?: Record<string, string> | null,
    isRetryable: boolean = false
  ) {
    super(generateErrorId(), ClientCommonErrorCodes.CONTRACT_VIOLATION, args ?? null, isRetryable)
  }
}

/** Represents an invalid lifecycle state invocation error. */
export class CommonErrorLifecycle extends CommonError {
  public constructor(message: string, isRetryable: boolean = false) {
    super(generateErrorId(), ClientCommonErrorCodes.LIFECYCLE_ERROR, { [CommonErrorArgs.MESSAGE]: message }, isRetryable)
  }
}
