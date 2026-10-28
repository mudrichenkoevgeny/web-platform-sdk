import { describe, it, expect } from 'vitest'
import {
  StorageErrorCodes,
  StorageErrorArgs,
  StorageModuleStrings,
  CommonLocales
} from '@mudrichenkoevgeny/shared-foundation'
import { CommonError, generateErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageErrorParser } from './storage-error-parser'
import { StorageError } from '../model/storage-error'

describe('StorageErrorParser', () => {
  const parserEn = new StorageErrorParser(new StorageModuleStrings(undefined, CommonLocales.ENGLISH))
  const parserRu = new StorageErrorParser(new StorageModuleStrings(undefined, CommonLocales.RUSSIAN))

  it('parses domain storage error codes with arguments in English and Russian', () => {
    const sizeLimitError = StorageError.fileSizeExceedsLimit(1024, 2048, 'IMAGE', 'photo.jpg')
    expect(parserEn.parse(sizeLimitError)).toBe('The file size exceeds the maximum permitted limit of 1 KB.')
    expect(parserRu.parse(sizeLimitError)).toBe('Размер файла превышает максимально допустимый лимит в 1 KB.')

    const quotaError = {
      id: generateErrorId(),
      code: StorageErrorCodes.STORAGE_QUOTA_EXCEEDED,
      args: {
        [StorageErrorArgs.QUOTA_BYTES]: '10000',
        [StorageErrorArgs.USED_BYTES]: '12000'
      },
      isRetryable: false
    }
    expect(parserEn.parse(quotaError)).toBe('Storage quota exceeded (11 KB of 9 KB used).')
    expect(parserRu.parse(quotaError)).toBe('Превышен лимит хранилища (использовано 11 KB из 9 KB).')

    const notFoundError = {
      id: generateErrorId(),
      code: StorageErrorCodes.FILE_NOT_FOUND,
      args: { [StorageErrorArgs.FILE_ID]: 'file-123' },
      isRetryable: false
    }
    expect(parserEn.parse(notFoundError)).toBe('The requested file was not found.')
    expect(parserRu.parse(notFoundError)).toBe('Запрошенный файл не найден.')

    const unsupportedCategoryError = {
      id: generateErrorId(),
      code: StorageErrorCodes.UNSUPPORTED_STORAGE_CATEGORY,
      args: { [StorageErrorArgs.CATEGORY]: 'INVALID' },
      isRetryable: false
    }
    expect(parserEn.parse(unsupportedCategoryError)).toBe('The specified storage category is not supported.')
    expect(parserRu.parse(unsupportedCategoryError)).toBe('Указанная категория хранилища не поддерживается.')

    const unsupportedMimeError = StorageError.unsupportedMimeType('application/exe')
    expect(parserEn.parse(unsupportedMimeError)).toBe('The provided file type is not supported.')
    expect(parserRu.parse(unsupportedMimeError)).toBe('Указанный тип файла не поддерживается.')
  })

  it('parses domain storage error codes without arguments falling back to default strings', () => {
    const sizeLimitWithoutArgs = StorageError.fileSizeExceedsLimit()
    expect(parserEn.parse(sizeLimitWithoutArgs)).toBe('The file size exceeds the maximum permitted limit.')

    const quotaWithoutArgs = {
      id: generateErrorId(),
      code: StorageErrorCodes.STORAGE_QUOTA_EXCEEDED,
      args: null,
      isRetryable: false
    }
    expect(parserEn.parse(quotaWithoutArgs)).toBe('Storage quota limit exceeded.')
  })

  it('parses client storage error codes and respects custom message when present', () => {
    const s3Error = StorageError.s3UploadFailed('Connection reset by peer')
    expect(parserEn.parse(s3Error)).toBe('Failed to upload the file. Please try again.')

    const s3ErrorWithoutMessage = StorageError.s3UploadFailed()
    expect(parserEn.parse(s3ErrorWithoutMessage)).toBe('Failed to upload the file. Please try again.')

    const cancelError = StorageError.directUploadCancelled()
    expect(parserEn.parse(cancelError)).toBe('Upload was cancelled.')
  })

  it('supports dynamic language getter function for reactive localizations', () => {
    let currentLanguage = new StorageModuleStrings(undefined, CommonLocales.ENGLISH)
    const dynamicParser = new StorageErrorParser(() => currentLanguage)

    const error = StorageError.fileSizeExceedsLimit(100)
    expect(dynamicParser.parse(error)).toBe('The file size exceeds the maximum permitted limit of 100 B.')

    currentLanguage = new StorageModuleStrings(undefined, CommonLocales.RUSSIAN)
    expect(dynamicParser.parse(error)).toBe('Размер файла превышает максимально допустимый лимит в 100 B.')
  })

  it('returns null for unhandled non-storage error codes', () => {
    expect(parserEn.parse(CommonError.unknown())).toBeNull()
  })
})
