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
