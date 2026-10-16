import { describe, it, expect } from 'vitest'
import { cleanSearchParams } from './clean-search-params'

describe('cleanSearchParams', () => {
  it('removes empty arrays, null, and undefined values', () => {
    const raw = {
      pageNumber: 1,
      pageSize: 20,
      identifiers: [],
      userAuthProviders: ['EMAIL'],
      emptyNull: null,
      emptyUndefined: undefined
    }

    const cleaned = cleanSearchParams(raw)

    expect(cleaned).toEqual({
      pageNumber: 1,
      pageSize: 20,
      userAuthProviders: ['EMAIL']
    })
  })
})
