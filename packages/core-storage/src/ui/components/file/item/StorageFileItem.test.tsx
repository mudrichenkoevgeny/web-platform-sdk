import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createTestStorageFileSummary, StorageCategory, toFileIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileItem } from './StorageFileItem'

describe('StorageFileItem', () => {
  const sampleFile = createTestStorageFileSummary({
    id: toFileIdOrThrow('file-1'),
    fileName: 'avatar.jpg',
    category: StorageCategory.IMAGE,
    fileSizeBytes: 2048
  })

  it('renders file details correctly', () => {
    render(<StorageFileItem file={sampleFile} />)

    expect(screen.getByText('avatar.jpg')).toBeDefined()
    expect(screen.getByText(StorageCategory.IMAGE)).toBeDefined()
  })

  it('calls onFileClick when card is clicked', () => {
    const onFileClick = vi.fn()
    render(<StorageFileItem file={sampleFile} onFileClick={onFileClick} />)

    const button = screen.getByRole('button', { name: /avatar\.jpg/i })
    fireEvent.click(button)

    expect(onFileClick).toHaveBeenCalledTimes(1)
  })

  it('calls onDeleteClick when delete button is clicked', () => {
    const onDeleteClick = vi.fn()
    render(<StorageFileItem file={sampleFile} onDeleteClick={onDeleteClick} />)

    const deleteBtn = screen.getByRole('button', { name: 'Delete File' })
    fireEvent.click(deleteBtn)

    expect(onDeleteClick).toHaveBeenCalledTimes(1)
  })
})
