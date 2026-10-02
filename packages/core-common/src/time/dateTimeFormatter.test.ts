import { describe, it, expect } from 'vitest'
import { formatEpochMillisToDateTime, formatInstantToDateTime } from './dateTimeFormatter'

describe('dateTimeFormatter', () => {
  it('formats epoch millis number correctly', () => {
    const timestamp = 1700000000000
    const formatted = formatEpochMillisToDateTime(timestamp)

    expect(formatted).not.toBeNull()
    expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2} \(UTC.*\)$/)
  })

  it('formats string epoch millis correctly', () => {
    const formatted = formatEpochMillisToDateTime('1700000000000')

    expect(formatted).not.toBeNull()
    expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2} \(UTC.*\)$/)
  })

  it('returns null for null, undefined, blank or invalid input', () => {
    expect(formatEpochMillisToDateTime(null)).toBeNull()
    expect(formatEpochMillisToDateTime(undefined)).toBeNull()
    expect(formatEpochMillisToDateTime('')).toBeNull()
    expect(formatEpochMillisToDateTime('invalid')).toBeNull()
  })

  it('formatInstantToDateTime accepts Date instance', () => {
    const date = new Date(1700000000000)
    const formatted = formatInstantToDateTime(date)

    expect(formatted).not.toBeNull()
  })
})
