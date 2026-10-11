import { describe, it, expect } from 'vitest'
import { AuditFilterValues } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { searchParamsToListingStates, listingStatesToSearchParams } from './auditEventListSearchConverters'
import type { AuditEventListSearchParams } from './auditEventListSearchSchema'

describe('auditEventListSearchConverters', () => {
  it('converts AuditEventListSearchParams to ListingOptionsState', () => {
    const params: AuditEventListSearchParams = {
      actorIds: ['user-123'],
      sortBy: 'CREATED_AT',
      sortOrder: 'DESC'
    }

    const result = searchParamsToListingStates(params)

    expect(result.sortState).toEqual({
      optionId: 'CREATED_AT',
      isAscending: false
    })

    const actorIdFilter = result.filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_ID]
    expect(actorIdFilter).toEqual({
      type: 'text',
      value: 'user-123'
    })
  })

  it('converts ListingOptionsState to AuditEventListSearchParams', () => {
    const sortState: ListingSortState = {
      optionId: 'CREATED_AT',
      isAscending: true
    }

    const filterStates: Record<string, ListingFilterState> = {
      [AuditFilterValues.AuditEventFilterValues.ACTOR_ID]: {
        type: 'text',
        value: 'user-456'
      },
      [AuditFilterValues.AuditEventFilterValues.STATUS]: {
        type: 'choice',
        selectedIds: new Set(['SUCCESS'])
      }
    }

    const result = listingStatesToSearchParams(sortState, filterStates)

    expect(result).toEqual({
      sortBy: 'CREATED_AT',
      sortOrder: 'ASC',
      actorIds: ['user-456'],
      statuses: ['SUCCESS']
    })
  })

  it('handles empty inputs gracefully', () => {
    expect(searchParamsToListingStates()).toEqual({
      sortState: null,
      filterStates: {}
    })

    expect(listingStatesToSearchParams(null, {})).toEqual({})
  })
})
