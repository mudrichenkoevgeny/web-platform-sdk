import { AppError } from '../error/model/AppError'

export const ListingConstants = {
  DEFAULT_PAGE_SIZE: 20
} as const

export interface PaginationState<T> {
  readonly items: T[]
  readonly pageNumber: number
  readonly totalPages: number
  readonly totalCount: number
  readonly isNextPageLoading?: boolean
  readonly error?: AppError | null
}

export interface BaseListingFilterDefinition {
  readonly id: string
  readonly title: string
}

export interface TextListingFilterDefinition extends BaseListingFilterDefinition {
  readonly type: 'text'
  readonly placeholder: string
}

export interface NumberListingFilterDefinition extends BaseListingFilterDefinition {
  readonly type: 'number'
  readonly placeholder: string
  readonly minValue?: number
  readonly maxValue?: number
  readonly defaultValueOnFocusLost?: number
}

export interface BooleanListingFilterDefinition extends BaseListingFilterDefinition {
  readonly type: 'boolean'
  readonly trueLabel?: string
  readonly falseLabel?: string
}

export interface ListingFilterChoiceOption {
  readonly id: string
  readonly title: string
}

export enum ChoiceFilterPresentationStyle {
  AUTO = 'AUTO',
  CHIPS = 'CHIPS',
  DROPDOWN = 'DROPDOWN'
}

export interface ChoiceListingFilterDefinition extends BaseListingFilterDefinition {
  readonly type: 'choice'
  readonly options: ListingFilterChoiceOption[]
  readonly isMultiple?: boolean
  readonly isSearchable?: boolean
  readonly presentationStyle?: ChoiceFilterPresentationStyle
}

export type ListingFilterDefinition =
  | TextListingFilterDefinition
  | NumberListingFilterDefinition
  | BooleanListingFilterDefinition
  | ChoiceListingFilterDefinition

export type ListingFilterState =
  | { readonly type: 'text'; readonly value: string }
  | { readonly type: 'number'; readonly value: number }
  | { readonly type: 'boolean'; readonly value: boolean }
  | { readonly type: 'choice'; readonly selectedIds: Set<string> }

export interface ListingSortDefinition {
  readonly id: string
  readonly title: string
}

export interface ListingSortState {
  readonly optionId: string
  readonly isAscending: boolean
}

export interface ListingOptionsConfig {
  readonly sortOptions: ListingSortDefinition[]
  readonly filters: ListingFilterDefinition[]
}
