export const formatEpochMillisToDateTime = (
  epochMillis?: number | string | null
): string | null => {
  if (epochMillis === null || epochMillis === undefined || epochMillis === '') {
    return null
  }

  const numericEpoch = typeof epochMillis === 'string' ? Number(epochMillis) : epochMillis
  if (isNaN(numericEpoch) || !isFinite(numericEpoch)) {
    return null
  }

  try {
    const date = new Date(numericEpoch)
    if (isNaN(date.getTime())) {
      return null
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear())
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')

    const offsetMinutes = -date.getTimezoneOffset()
    let offsetString = 'UTC'

    if (offsetMinutes !== 0) {
      const sign = offsetMinutes > 0 ? '+' : '-'
      const absMinutes = Math.abs(offsetMinutes)
      const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0')
      const mins = String(absMinutes % 60).padStart(2, '0')

      offsetString = mins === '00' ? `UTC${sign}${hours}` : `UTC${sign}${hours}:${mins}`
    }

    return `${day}.${month}.${year} ${hour}:${minute} (${offsetString})`
  } catch {
    return null
  }
}

export const formatInstantToDateTime = (date?: Date | null): string | null => {
  if (!date || isNaN(date.getTime())) {
    return null
  }
  return formatEpochMillisToDateTime(date.getTime())
}
