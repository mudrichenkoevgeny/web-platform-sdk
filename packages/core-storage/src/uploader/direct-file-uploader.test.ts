import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { DirectFileUploaderImpl, uploadFileDirectly } from './direct-file-uploader'

describe('DirectFileUploaderImpl', () => {
  let mockXHR: {
    open: ReturnType<typeof vi.fn>
    setRequestHeader: ReturnType<typeof vi.fn>
    send: ReturnType<typeof vi.fn>
    upload: { onprogress: ((e: ProgressEvent) => void) | null }
    onload: (() => void) | null
    onerror: (() => void) | null
    status: number
  }

  beforeEach(() => {
    mockXHR = {
      open: vi.fn(),
      setRequestHeader: vi.fn(),
      send: vi.fn(),
      upload: { onprogress: null },
      onload: null,
      onerror: null,
      status: 200
    }

    vi.stubGlobal(
      'XMLHttpRequest',
      vi.fn().mockImplementation(function (this: unknown) {
        return mockXHR
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends file via PUT request with correct headers', async () => {
    const uploader = new DirectFileUploaderImpl()
    const file = new File(['content'], 'test.png', { type: 'image/png' })

    const promise = uploader.uploadFile('https://storage.example.com/upload', file)

    if (mockXHR.onload) mockXHR.onload()
    const result = await promise

    expect(mockXHR.open).toHaveBeenCalledWith('PUT', 'https://storage.example.com/upload', true)
    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'image/png')
    expect(mockXHR.send).toHaveBeenCalledWith(file)
    expect(isSuccess(result)).toBe(true)
  })

  it('standalone uploadFileDirectly delegates to DirectFileUploaderImpl', async () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' })

    const promise = uploadFileDirectly('https://storage.example.com/upload', file)

    if (mockXHR.onload) mockXHR.onload()
    const result = await promise

    expect(isSuccess(result)).toBe(true)
  })
})
