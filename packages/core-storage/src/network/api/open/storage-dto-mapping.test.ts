import { describe, it, expect } from 'vitest'
import {
  storageFilePrivatePayloadSchema,
  toStorageFilePrivate,
  createTestStorageFilePrivatePayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('Storage DTO Schema & Mapping', () => {
  it('parses valid StorageFilePrivate snake_case payload and converts to domain model', () => {
    const rawPayload = createTestStorageFilePrivatePayload({
      file_id: 'file-123',
      file_name: 'document.pdf',
      file_size_bytes: 4096,
      mime_type: 'application/pdf',
      category: 'DOCUMENT',
      visibility: 'PRIVATE',
      status: 'READY',
      file_urls: { original_url: 'https://cdn.example.com/document.pdf' },
      created_at: 1700000000000,
      updated_at: 1700000010000
    })

    const parseResult = storageFilePrivatePayloadSchema.safeParse(rawPayload)
    expect(parseResult.success).toBe(true)

    if (parseResult.success) {
      const domainModel = toStorageFilePrivate(parseResult.data)

      expect(domainModel.id).toBe('file-123')
      expect(domainModel.fileName).toBe('document.pdf')
      expect(domainModel.fileSizeBytes).toBe(4096)
      expect(domainModel.mimeType).toBe('application/pdf')
      expect(domainModel.category).toBe('DOCUMENT')
      expect(domainModel.visibility).toBe('PRIVATE')
      expect(domainModel.status).toBe('READY')
      expect(domainModel.fileUrls?.originalUrl).toBe('https://cdn.example.com/document.pdf')
      expect(domainModel.createdAt).toBe(1700000000000)
      expect(domainModel.updatedAt).toBe(1700000010000)
    }
  })

  it('rejects payloads missing required file_id property', () => {
    const rawInvalid = {
      file_name: 'no-id.pdf'
    }

    const parseResult = storageFilePrivatePayloadSchema.safeParse(rawInvalid)
    expect(parseResult.success).toBe(false)
  })
})
