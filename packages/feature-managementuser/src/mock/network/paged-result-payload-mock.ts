/** Raw paged result payload from API endpoints before schema parsing. */
export interface PagedResultPayload<T> {
  items: T[]
  total_count: number
  page_number: number
  page_size: number
  total_pages: number
}

/** Creates a mock {@link PagedResultPayload} instance for testing. */
export const pagedResultPayloadMock = <T>(
  items: T[] = [],
  overrides?: Partial<PagedResultPayload<T>>
): PagedResultPayload<T> => ({
  items,
  total_count: items.length,
  page_number: 1,
  page_size: 10,
  total_pages: items.length > 0 ? Math.ceil(items.length / 10) : 0,
  ...overrides
})
