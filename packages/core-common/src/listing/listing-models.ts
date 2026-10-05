import type { AppError } from '@/error/model/app-error'

/** Constants for listing operations. */
export const ListingConstants = {
  /** Default page size for paginated listing requests. */
  DEFAULT_PAGE_SIZE: 20
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
  /** Indicates whether the next page is currently loading. */
  readonly isNextPageLoading?: boolean
  /** Error encountered during page fetch, if any. */
  readonly error?: AppError | null
}

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
