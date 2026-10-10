import type { PagedResult } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@/error/model/app-error'

/** Constants for listing operations. */
export const ListingConstants = {
  /** Default page size for paginated listing requests. */
  DEFAULT_PAGE_SIZE: 20,
  /** Large page size for extended listing queries. */
  LARGE_PAGE_SIZE: 100,
  /** Initial page number index (1-based). */
  INITIAL_PAGE_NUMBER: 1
} as const

/**
 * Pagination state for a paginated list of items.
 */
export interface PaginationState<T> {
  /** Array of items loaded for the current pagination state. */
  readonly items: T[]
  /** Current page number index (1-based). */
  readonly pageNumber: number
  /** Total number of pages available. */
  readonly totalPages: number
  /** Total count of items matching the query across all pages. */
  readonly totalCount: number
  /** Indicates whether initial page loading is in progress. */
  readonly isInitialLoading?: boolean
  /** Indicates whether the next page is currently loading. */
  readonly isNextPageLoading?: boolean
  /** Error encountered during page fetch, if any. */
  readonly error?: AppError | null
}

/** Creates an initial empty pagination state before initial page fetch. */
export const createInitialPaginationState = <T>(): PaginationState<T> => ({
  items: [],
  pageNumber: 0,
  totalPages: 0,
  totalCount: 0,
  isInitialLoading: true,
  isNextPageLoading: false,
  error: null
})

/** Computes the next page number to fetch. */
export const getNextPageNumber = <T>(state: PaginationState<T>): number =>
  state.pageNumber === 0 ? ListingConstants.INITIAL_PAGE_NUMBER : state.pageNumber + 1

/** Checks whether more pages are available to fetch. */
export const hasMorePages = <T>(state: PaginationState<T>): boolean =>
  state.pageNumber < state.totalPages

/** Checks whether pagination is idle (no active loading requests). */
export const isPaginationIdle = <T>(state: PaginationState<T>): boolean =>
  !state.isInitialLoading && !state.isNextPageLoading

/** Checks whether next page load can be dispatched. */
export const canLoadMorePages = <T>(state: PaginationState<T>): boolean =>
  hasMorePages(state) && isPaginationIdle(state)

/** Creates a pagination state with next page loading indicator enabled. */
export const createNextPageLoadingPaginationState = <T>(
  current: PaginationState<T>
): PaginationState<T> => ({
  ...current,
  isNextPageLoading: true
})

/** Appends or replaces page result items into pagination state. */
export const appendResultToPaginationState = <T>(
  currentPaging: PaginationState<T>,
  result: PagedResult<T>
): PaginationState<T> => ({
  items: currentPaging.pageNumber === 0 || result.pageNumber === 1 ? result.items : [...currentPaging.items, ...result.items],
  pageNumber: result.pageNumber,
  totalPages: result.totalPages,
  totalCount: result.totalCount,
  isInitialLoading: false,
  isNextPageLoading: false,
  error: null
})

/** Sets error on pagination state. */
export const setPaginationError = <T>(
  state: PaginationState<T>,
  error: AppError,
  isInitial: boolean
): PaginationState<T> => ({
  ...state,
  isInitialLoading: false,
  isNextPageLoading: false,
  error,
  items: isInitial ? [] : state.items
})

/** Removes an item matching the predicate from pagination state. */
export const removePaginationItem = <T>(
  state: PaginationState<T>,
  predicate: (item: T) => boolean
): PaginationState<T> => ({
  ...state,
  items: state.items.filter((item) => !predicate(item))
})

/** Base contract for filter definitions. */
export interface BaseListingFilterDefinition {
  /** Unique filter identifier. */
  readonly id: string
  /** Human-readable title label for the filter. */
  readonly title: string
}

/** Text filter definition. */
export interface TextListingFilterDefinition extends BaseListingFilterDefinition {
  /** Filter type discriminator. */
  readonly type: 'text'
  /** Placeholder text for input field. */
  readonly placeholder: string
}

/** Number range filter definition. */
export interface NumberListingFilterDefinition extends BaseListingFilterDefinition {
  /** Filter type discriminator. */
  readonly type: 'number'
  /** Input placeholder text. */
  readonly placeholder: string
  /** Minimum permitted value. */
  readonly minValue?: number
  /** Maximum permitted value. */
  readonly maxValue?: number
  /** Default numerical value set on focus lost if input was cleared. */
  readonly defaultValueOnFocusLost?: number
}

/** Boolean toggle filter definition. */
export interface BooleanListingFilterDefinition extends BaseListingFilterDefinition {
  /** Filter type discriminator. */
  readonly type: 'boolean'
  /** Label displayed for true state. */
  readonly trueLabel?: string
  /** Label displayed for false state. */
  readonly falseLabel?: string
}

/** Option item for multi-choice filters. */
export interface ListingFilterChoiceOption {
  /** Choice option identifier. */
  readonly id: string
  /** Option title text. */
  readonly title: string
}

/** Visual presentation style for choice filter controls. */
export enum ChoiceFilterPresentationStyle {
  /** Automatic adaptive layout based on option count. */
  AUTO = 'AUTO',
  /** Rendered as interactive chips. */
  CHIPS = 'CHIPS',
  /** Rendered as a select dropdown menu. */
  DROPDOWN = 'DROPDOWN'
}

/** Choice selection filter definition. */
export interface ChoiceListingFilterDefinition extends BaseListingFilterDefinition {
  /** Filter type discriminator. */
  readonly type: 'choice'
  /** List of selectable options. */
  readonly options: ListingFilterChoiceOption[]
  /** Whether multiple choices can be selected simultaneously. */
  readonly isMultiple?: boolean
  /** Whether option search input is enabled. */
  readonly isSearchable?: boolean
  /** Presentation layout style. */
  readonly presentationStyle?: ChoiceFilterPresentationStyle
}

/** Discriminated union of supported listing filter definitions. */
export type ListingFilterDefinition =
  | TextListingFilterDefinition
  | NumberListingFilterDefinition
  | BooleanListingFilterDefinition
  | ChoiceListingFilterDefinition

/** Discriminated union of active listing filter values. */
export type ListingFilterState =
  | { readonly type: 'text'; readonly value: string }
  | { readonly type: 'number'; readonly value: number }
  | { readonly type: 'boolean'; readonly value: boolean }
  | { readonly type: 'choice'; readonly selectedIds: Set<string> }

/** Definition for a listing sort option. */
export interface ListingSortDefinition {
  /** Sort option identifier. */
  readonly id: string
  /** Display label for the sort option. */
  readonly title: string
}

/** State of active sorting configuration. */
export interface ListingSortState {
  /** Active sort option identifier. */
  readonly optionId: string
  /** Whether sorting direction is ascending. */
  readonly isAscending: boolean
}

/** Combined listing configuration containing sort and filter definitions. */
export interface ListingOptionsConfig {
  /** Available sort options. */
  readonly sortOptions: ListingSortDefinition[]
  /** Available filter definitions. */
  readonly filters: ListingFilterDefinition[]
}

