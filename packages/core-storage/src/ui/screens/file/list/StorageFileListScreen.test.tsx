import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  createTestPagedResult,
  createTestStorageFileSummary,
  StorageFileFilterValues,
  StorageFileSortBy,
  StorageCategory,
  StorageFileVisibility,
  StorageFileStatus
} from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileListScreen, StorageFileListTestTags } from './StorageFileListScreen'
import type { StorageFileListStoreDependencies } from './storage-file-list-store'
import { createSelfStorageFileListDataSource, mapQueryToManagementStorageParams } from './storage-file-list-data-source'
import { getStorageFileListOptionsConfig } from './storage-file-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from './storage-file-list-search-converters'

describe('StorageFileListScreen - Complete Filter & Sort Audit', () => {
  const createMockDeps = (): StorageFileListStoreDependencies => ({
    dataSource: createSelfStorageFileListDataSource({
      getFilesUseCase: {
        execute: vi.fn().mockResolvedValue(
          appResultSuccess(createTestPagedResult({ items: [createTestStorageFileSummary()] }))
        )
      }
    }),
    onBack: vi.fn()
  })

  it('renders screen title and list content', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <StorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(StorageFileListTestTags.TITLE)).toBeDefined()
    expect(screen.getByTestId(StorageFileListTestTags.FILE_LIST)).toBeDefined()
  })

  it('dynamically covers all sort options and filter fields declared in shared-foundation', () => {
    const config = getStorageFileListOptionsConfig(undefined, undefined, true)

    const expectedSortKeys = Object.values(StorageFileSortBy)
    const actualSortKeys = config.sortOptions.map((s) => s.id)
    expect(actualSortKeys).toEqual(expect.arrayContaining(expectedSortKeys))
    expect(actualSortKeys.length).toBe(expectedSortKeys.length)

    const expectedFilterKeys = Object.values(StorageFileFilterValues)
    const actualFilterKeys = config.filters.map((f) => f.id)
    expect(actualFilterKeys).toEqual(expect.arrayContaining(expectedFilterKeys))
    expect(actualFilterKeys.length).toBe(expectedFilterKeys.length)
  })

  it('converts all search parameters to listing states and back bidirectionally', () => {
    const originalParams = {
      ownerUserId: 'user-100',
      isOwnerUserIdSet: true,
      fileId: 'file-200',
      fileName: 'document.pdf',
      fileSizeBytesFrom: 1024,
      fileSizeBytesTo: 204800,
      mimeType: 'application/pdf',
      category: StorageCategory.DOCUMENT,
      excludeCategory: StorageCategory.OTHER,
      visibility: StorageFileVisibility.PUBLIC,
      excludeVisibility: StorageFileVisibility.PRIVATE,
      status: StorageFileStatus.READY,
      excludeStatus: StorageFileStatus.DELETED,
      targetScope: 'AVATAR',
      isTargetScopeSet: true,
      createdAtFrom: '2025-01-01T00:00:00Z',
      createdAtTo: '2025-01-31T23:59:59Z',
      updatedAtFrom: '2025-02-01T00:00:00Z',
      updatedAtTo: '2025-02-28T23:59:59Z',
      isUpdatedAtSet: true,
      searchQuery: 'pdf report',
      sortBy: 'file_size_bytes',
      sortOrder: 'asc'
    }

    const { sortState, filterStates } = searchParamsToListingStates(originalParams)

    expect(sortState).toEqual({ optionId: 'file_size_bytes', isAscending: true })
    expect(filterStates[StorageFileFilterValues.OWNER_USER_ID]).toEqual({ type: 'text', value: 'user-100' })
    expect(filterStates[StorageFileFilterValues.IS_OWNER_USER_ID_SET]).toEqual({ type: 'boolean', value: true })
    expect(filterStates[StorageFileFilterValues.FILE_ID]).toEqual({ type: 'text', value: 'file-200' })
    expect(filterStates[StorageFileFilterValues.FILE_NAME]).toEqual({ type: 'text', value: 'document.pdf' })
    expect(filterStates[StorageFileFilterValues.FILE_SIZE_BYTES_FROM]).toEqual({ type: 'number', value: 1024 })
    expect(filterStates[StorageFileFilterValues.FILE_SIZE_BYTES_TO]).toEqual({ type: 'number', value: 204800 })
    expect(filterStates[StorageFileFilterValues.MIME_TYPE]).toEqual({ type: 'text', value: 'application/pdf' })
    expect(filterStates[StorageFileFilterValues.CATEGORY]).toEqual({ type: 'choice', selectedIds: new Set([StorageCategory.DOCUMENT]) })
    expect(filterStates[StorageFileFilterValues.EXCLUDE_CATEGORY]).toEqual({ type: 'choice', selectedIds: new Set([StorageCategory.OTHER]) })
    expect(filterStates[StorageFileFilterValues.VISIBILITY]).toEqual({ type: 'choice', selectedIds: new Set([StorageFileVisibility.PUBLIC]) })
    expect(filterStates[StorageFileFilterValues.EXCLUDE_VISIBILITY]).toEqual({ type: 'choice', selectedIds: new Set([StorageFileVisibility.PRIVATE]) })
    expect(filterStates[StorageFileFilterValues.STATUS]).toEqual({ type: 'choice', selectedIds: new Set([StorageFileStatus.READY]) })
    expect(filterStates[StorageFileFilterValues.EXCLUDE_STATUS]).toEqual({ type: 'choice', selectedIds: new Set([StorageFileStatus.DELETED]) })
    expect(filterStates[StorageFileFilterValues.TARGET_SCOPE]).toEqual({ type: 'text', value: 'AVATAR' })
    expect(filterStates[StorageFileFilterValues.IS_TARGET_SCOPE_SET]).toEqual({ type: 'boolean', value: true })
    expect(filterStates[StorageFileFilterValues.CREATED_AT_FROM]).toEqual({ type: 'text', value: '2025-01-01T00:00:00Z' })
    expect(filterStates[StorageFileFilterValues.CREATED_AT_TO]).toEqual({ type: 'text', value: '2025-01-31T23:59:59Z' })
    expect(filterStates[StorageFileFilterValues.UPDATED_AT_FROM]).toEqual({ type: 'text', value: '2025-02-01T00:00:00Z' })
    expect(filterStates[StorageFileFilterValues.UPDATED_AT_TO]).toEqual({ type: 'text', value: '2025-02-28T23:59:59Z' })
    expect(filterStates[StorageFileFilterValues.IS_UPDATED_AT_SET]).toEqual({ type: 'boolean', value: true })
    expect(filterStates[StorageFileFilterValues.SEARCH_QUERY]).toEqual({ type: 'text', value: 'pdf report' })

    const reserialized = listingStatesToSearchParams(sortState, filterStates)
    expect(reserialized).toEqual(originalParams)
  })

  it('maps UI query filter states to management API query DTO', () => {
    const { sortState, filterStates } = searchParamsToListingStates({
      ownerUserId: 'usr-9',
      isOwnerUserIdSet: true,
      fileSizeBytesFrom: 500,
      fileSizeBytesTo: 5000,
      excludeCategory: StorageCategory.OTHER,
      excludeVisibility: StorageFileVisibility.PRIVATE,
      excludeStatus: StorageFileStatus.DELETED,
      isTargetScopeSet: false,
      isUpdatedAtSet: false,
      searchQuery: 'contract'
    })

    const apiParams = mapQueryToManagementStorageParams({
      pageNumber: 1,
      sortState,
      filterStates
    })

    expect(apiParams.ownerUserIds).toEqual(['usr-9'])
    expect(apiParams.isOwnerUserIdSet).toBe(true)
    expect(apiParams.fileSizeBytesFrom).toBe(500)
    expect(apiParams.fileSizeBytesTo).toBe(5000)
    expect(apiParams.excludeCategories).toEqual([StorageCategory.OTHER])
    expect(apiParams.excludeVisibilities).toEqual([StorageFileVisibility.PRIVATE])
    expect(apiParams.excludeStatuses).toEqual([StorageFileStatus.DELETED])
    expect(apiParams.isTargetScopeSet).toBe(false)
    expect(apiParams.isUpdatedAtSet).toBe(false)
    expect(apiParams.searchQuery).toBe('contract')
  })

  it('toggles filter panel in UI when options button is clicked', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <StorageFileListScreen dependencies={deps} includeOwnerFilter={true} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(StorageFileListTestTags.TITLE)).toBeDefined()

    const filterBtn = screen.getByRole('button', { name: 'Filter' })
    expect(filterBtn).toBeDefined()

    fireEvent.click(filterBtn)

    // Options panel should now be visible with filter controls and apply button
    expect(screen.getByText('Apply')).toBeDefined()
  })
})
