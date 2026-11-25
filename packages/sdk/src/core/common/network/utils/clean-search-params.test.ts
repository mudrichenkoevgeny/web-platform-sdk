import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { cleanSearchParams, parseSearchParams } from './clean-search-params'

describe('cleanSearchParams', () => {
  it('removes empty arrays, null, undefined values, and default pageNumber/pageSize', () => {
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
      userAuthProviders: ['EMAIL']
    })
  })

  it('preserves non-default pageNumber and pageSize', () => {
    const raw = {
      pageNumber: 2,
      pageSize: 50,
      userAuthProviders: ['EMAIL']
    }

    const cleaned = cleanSearchParams(raw)

    expect(cleaned).toEqual({
      pageNumber: 2,
      pageSize: 50,
      userAuthProviders: ['EMAIL']
    })
  })

  it('coerces stringified numbers and parses via parseSearchParams', () => {
    const schema = z.object({
      pageNumber: z.number().default(1),
      pageSize: z.number().default(20)
    })

    const raw = { pageNumber: '2', pageSize: '20' }
    const result = parseSearchParams(schema, raw)

    expect(result).toEqual({ pageNumber: 2 })
  })
})
