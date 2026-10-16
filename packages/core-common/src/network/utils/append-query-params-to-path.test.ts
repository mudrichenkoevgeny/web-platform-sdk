import { describe, expect, it } from 'vitest'
import { appendQueryParamsToPath, type NavigationScreenParams } from './append-query-params-to-path'

describe('appendQueryParamsToPath', () => {
  it('returns basePath unchanged when params is null or undefined', () => {
    expect(appendQueryParamsToPath('/api/test')).toBe('/api/test')
    expect(appendQueryParamsToPath('/api/test', null)).toBe('/api/test')
    expect(appendQueryParamsToPath('/api/test', undefined)).toBe('/api/test')
  })

  it('appends query string from record of array values', () => {
    const params = {
      page_number: ['2'],
      sort_by: ['created_at'],
      filter: ['a', 'b']
    }
    expect(appendQueryParamsToPath('/api/test', params)).toBe(
      '/api/test?page_number=2&sort_by=created_at&filter=a&filter=b'
    )
  })

  it('appends query string from Map of array values', () => {
    const params = new Map<string, string[]>([
      ['page_number', ['1']],
      ['status', ['active', 'pending']]
    ])
    expect(appendQueryParamsToPath('/api/test', params)).toBe(
      '/api/test?page_number=1&status=active&status=pending'
    )
  })

  it('handles NavigationScreenParams with toQueryMap method', () => {
    const mockParams: NavigationScreenParams = {
      toQueryMap: () => new Map<string, string[]>([
        ['page_number', ['3']],
        ['sort_order', ['desc']]
      ])
    }
    expect(appendQueryParamsToPath('/api/test', mockParams)).toBe(
      '/api/test?page_number=3&sort_order=desc'
    )
  })

  it('omits empty strings and nulls', () => {
    const params = {
      valid: ['ok'],
      empty: [''],
      nullish: [null as unknown as string]
    }
    expect(appendQueryParamsToPath('/api/test', params)).toBe('/api/test?valid=ok')
  })

  it('omits query string when toQueryMap returns an empty map for default values (clean URLs)', () => {
    const mockParams: NavigationScreenParams = {
      toQueryMap: () => new Map<string, string[]>()
    }
    expect(appendQueryParamsToPath('/api/test', mockParams)).toBe('/api/test')
  })

  it('supports Record with scalar primitive values', () => {
    const params = {
      pageNumber: 1,
      sortBy: 'created_at',
      isTotpEnabled: true
    }
    expect(appendQueryParamsToPath('/api/test', params)).toBe(
      '/api/test?pageNumber=1&sortBy=created_at&isTotpEnabled=true'
    )
  })
})
