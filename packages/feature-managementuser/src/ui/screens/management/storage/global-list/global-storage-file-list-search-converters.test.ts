import { describe, it, expect } from 'vitest'
import { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  listingStatesToSearchParams,
  searchParamsToListingStates
} from './global-storage-file-list-search-converters'

describe('globalStorageFileListSearchConverters', () => {
  it('converts search params to listing states', () => {
    const rawParams = {
      ownerUserId: 'usr_123',
      category: 'image',
      sortBy: 'file_name',
      sortOrder: 'asc'
    }

    const listingStates = searchParamsToListingStates(rawParams)

    expect(listingStates.sortState?.sortBy).toBe('file_name')
    expect(listingStates.sortState?.sortOrder).toBe('asc')
    expect(listingStates.filterStates.ownerUserId?.value).toEqual(['usr_123'])
    expect(listingStates.filterStates.category?.value).toEqual(['image'])
  })

  it('converts listing states to search params', () => {
    const sortState = new ListingSortState('file_name', 'desc')
    const filterStates = {
      ownerUserId: new ListingFilterState('ownerUserId', ['usr_123'])
    }

    const searchParams = listingStatesToSearchParams(sortState, filterStates)

    expect(searchParams.sortBy).toBe('file_name')
    expect(searchParams.sortOrder).toBe('desc')
    expect(searchParams.ownerUserId).toBe('usr_123')
  })
})
