import { describe, it, expect } from 'vitest'
import { StorageCategory } from '@mudrichenkoevgeny/shared-foundation'
import {
  listingStatesToSearchParams,
  searchParamsToListingStates
} from './storage-file-list-search-converters'

describe('storage-file-list-search-converters', () => {
  it('converts filter and sort states to search params and back', () => {
    const { sortState, filterStates } = searchParamsToListingStates({
      category: StorageCategory.IMAGE,
      fileName: 'test'
    })

    expect(filterStates.category).toBeDefined()
    expect(filterStates.fileName).toBeDefined()

    const searchParams = listingStatesToSearchParams(sortState, filterStates)
    expect(searchParams.category).toBe(StorageCategory.IMAGE)
    expect(searchParams.fileName).toBe('test')
  })
})
