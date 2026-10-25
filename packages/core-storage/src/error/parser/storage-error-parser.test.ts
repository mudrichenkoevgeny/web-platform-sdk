import { describe, it, expect } from 'vitest'
import {
  StorageModuleStrings,
  CommonLocales
} from '@mudrichenkoevgeny/shared-foundation'
import { CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageErrorParser } from './storage-error-parser'
import { StorageError } from '../model/storage-error'

describe('StorageErrorParser', () => {
  const parserEn = new StorageErrorParser(new StorageModuleStrings(undefined, CommonLocales.ENGLISH))
  const parserRu = new StorageErrorParser(new StorageModuleStrings(undefined, CommonLocales.RUSSIAN))

  it('parses domain storage error codes with arguments in English and Russian', () => {
    const sizeLimitError = StorageError.fileSizeExceedsLimit(1024, 2048, 'IMAGE', 'photo.jpg')
    expect(parserEn.parse(sizeLimitError)).toBe('The file size exceeds the maximum permitted limit of 1024 bytes.')
    expect(parserRu.parse(sizeLimitError)).toBe('Размер файла превышает максимально допустимый предел в 1024 байт.')

    const quotaError = StorageError.storageQuotaExceeded(10000, 12000)
    expect(parserEn.parse(quotaError)).toBe('Storage quota exceeded (12000 of 10000 bytes used).')
    expect(parserRu.parse(quotaError)).toBe('Превышен лимит объема хранилища (использовано 12000 из 10000 байт).')

    const notFoundError = StorageError.fileNotFound('file-123')
    expect(parserEn.parse(notFoundError)).toBe('The requested file was not found.')
    expect(parserRu.parse(notFoundError)).toBe('Запрошенный файл не найден.')
  })

  it('parses domain storage error codes without arguments falling back to default strings', () => {
    const sizeLimitWithoutArgs = StorageError.fileSizeExceedsLimit()
    expect(parserEn.parse(sizeLimitWithoutArgs)).toBe('The file size exceeds the maximum permitted limit.')

    const quotaWithoutArgs = StorageError.storageQuotaExceeded()
    expect(parserEn.parse(quotaWithoutArgs)).toBe('Storage quota limit exceeded.')
  })

  it('parses client storage error codes and respects custom message when present', () => {
    const s3Error = StorageError.s3UploadFailed('Connection reset by peer')
    expect(parserEn.parse(s3Error)).toBe('Connection reset by peer')

    const s3ErrorWithoutMessage = StorageError.s3UploadFailed()
    expect(parserEn.parse(s3ErrorWithoutMessage)).toBe('Upload verification failed.')

    const cancelError = StorageError.directUploadCancelled()
    expect(parserEn.parse(cancelError)).toBe('Upload verification failed.')
  })

  it('supports dynamic language getter function for reactive localizations', () => {
    let currentLanguage = new StorageModuleStrings(undefined, CommonLocales.ENGLISH)
    const dynamicParser = new StorageErrorParser(() => currentLanguage)

    const error = StorageError.fileSizeExceedsLimit(100)
    expect(dynamicParser.parse(error)).toBe('The file size exceeds the maximum permitted limit of 100 bytes.')

    currentLanguage = new StorageModuleStrings(undefined, CommonLocales.RUSSIAN)
    expect(dynamicParser.parse(error)).toBe('Размер файла превышает максимально допустимый предел в 100 байт.')
  })

  it('returns null for unhandled non-storage error codes', () => {
    expect(parserEn.parse(CommonError.unknown())).toBeNull()
  })
})
