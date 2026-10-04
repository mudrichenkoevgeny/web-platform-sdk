import { describe, it, expect, vi } from 'vitest'
import { getLogMessage, logAppError } from './AppErrorLogger'
import { CommonError } from '@/model/CommonError'
import { ServerError } from '@/model/ServerError'
import { generateErrorId } from '@/model/ErrorId'

describe('AppErrorLogger', () => {
  it('formats getLogMessage correctly for CommonError without throwable or args', () => {
    const error = CommonError.unknown()
    const msg = getLogMessage(error)
    expect(msg).toBe(`id=${error.id}, code=${error.code}`)
  })

  it('formats getLogMessage with args and throwable', () => {
    const cause = new Error('Database connection failed')
    const error = CommonError.internal(cause)
    const msg = getLogMessage(error)
    expect(msg).toContain(`id=${error.id}, code=${error.code}`)
    expect(msg).toContain(`cause=${cause.stack}`)
  })

  it('formats getLogMessage with ServerError', () => {
    const id = generateErrorId()
    const error = new ServerError(id, 'INVALID_PAYLOAD', 'Message', { param: 'val' })
    const msg = getLogMessage(error)
    expect(msg).toBe(`id=${id}, code=INVALID_PAYLOAD, args={"param":"val"}`)
  })

  it('logAppError outputs formatted string to console.error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const error = CommonError.unknown()

    logAppError(error)

    expect(consoleSpy).toHaveBeenCalledWith(`id=${error.id}, code=${error.code}`)
    consoleSpy.mockRestore()
  })
})
