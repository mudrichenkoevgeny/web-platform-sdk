const delay = (ms: number, signal?: AbortSignal): Promise<void> => {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve()
      return
    }

    const timeout = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    const onAbort = () => {
      clearTimeout(timeout)
      resolve()
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

/**
 * Asynchronous countdown loop emitting tick events until total seconds elapse or signal aborts.
 *
 * @param totalSeconds - Total countdown duration in seconds
 * @param onTick - Callback function receiving remaining seconds on each tick
 * @param intervalMs - Tick interval duration in milliseconds (defaults to 1000)
 * @param abortSignal - Optional AbortSignal to cancel countdown early
 */
export const resendCountdown = async (
  totalSeconds: number,
  onTick: (remainingSeconds: number) => void,
  intervalMs: number = 1000,
  abortSignal?: AbortSignal
): Promise<void> => {
  let left = totalSeconds
  while (left > 0) {
    if (abortSignal?.aborted) {
      return
    }
    await delay(intervalMs, abortSignal)
    if (abortSignal?.aborted) {
      return
    }
    left--
    onTick(left)
  }
}
