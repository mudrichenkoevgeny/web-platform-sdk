import { describe, it, expect } from 'vitest'
import { AuditFilterValues, managementAuditEventListParamsSchema, SortOrder } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { searchParamsToListingStates, listingStatesToSearchParams } from './auditEventListSearchConverters'

describe('auditEventListSearchConverters', () => {
  it('converts ManagementAuditEventListParams to ListingOptionsState', () => {
    const params = managementAuditEventListParamsSchema.parse({
      pageNumber: 1,
      pageSize: 20,
      sortBy: 'created_at',
      sortOrder: SortOrder.DESC,
      actorIds: ['user-123'],
      actorTypes: [],
      actorUserRoles: [],
      actions: [],
      resources: [],
      resourceIds: [],
      statuses: [],
      messages: []
    })

    const result = searchParamsToListingStates(params)

    expect(result.sortState).toEqual({
      optionId: 'created_at',
      isAscending: false
    })

    const actorIdFilter = result.filterStates[AuditFilterValues.AuditEventFilterValues.ACTOR_ID]
    expect(actorIdFilter).toEqual({
      type: 'text',
      value: 'user-123'
    })
  })

  it('converts ListingOptionsState to ManagementAuditEventListParams', () => {
    const sortState: ListingSortState = {
      optionId: 'created_at',
      isAscending: true
    }

    const filterStates: Record<string, ListingFilterState> = {
      [AuditFilterValues.AuditEventFilterValues.ACTOR_ID]: {
        type: 'text',
        value: 'user-456'
      },
      [AuditFilterValues.AuditEventFilterValues.STATUS]: {
        type: 'choice',
        selectedIds: new Set(['success'])
      }
    }

    const result = listingStatesToSearchParams(sortState, filterStates)

    expect(result.sort_by).toBe('created_at')
    expect(result.sort_order).toBe(SortOrder.ASC)
    expect(result.actor_ids).toEqual(['user-456'])
    expect(result.statuses).toEqual(['success'])
  })

  it('handles empty inputs gracefully', () => {
    expect(searchParamsToListingStates()).toEqual({
      sortState: null,
      filterStates: {}
    })
  })
})
