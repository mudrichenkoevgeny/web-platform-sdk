import React, { forwardRef, useId } from 'react'
import { commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type {
  ListingOptionsConfig,
  ListingSortState,
  ListingFilterState
} from '@/listing/listing-models'
import { CoreButton } from '@/ui/components/button/button/CoreButton'
import { ListingChoiceDropdown } from '@/ui/components/listing/option/dropdown/ListingChoiceDropdown'
import { CoreOutlinedTextField } from '@/ui/components/input/outlined/CoreOutlinedTextField'
import { CoreTextButton } from '@/ui/components/button/text/CoreTextButton'
import { cn } from '@/utils/cn'

/** Props for {@link ListingOptionsPanel}. */
export interface ListingOptionsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Listing configuration containing sort options and filter definitions. */
  config: ListingOptionsConfig
  /** Active sort state or null if unsorted. */
  sortState: ListingSortState | null
  /** Map of active filter states keyed by filter ID. */
  filterStates: Record<string, ListingFilterState>
  /** Callback triggered when sorting selection changes. */
  onSortChanged: (sortState: ListingSortState) => void
  /** Callback triggered when a filter state changes or is cleared. */
  onFilterChanged: (filterId: string, newState: ListingFilterState | null) => void
  /** Callback triggered when user clicks the apply button. */
  onApplyClick: () => void
}

/**
 * Slide-out or collapsible panel component for configuring listing sorting and filtering options.
 */
export const ListingOptionsPanel = forwardRef<HTMLDivElement, ListingOptionsPanelProps>(
  (
    {
      config,
      sortState,
      filterStates,
      onSortChanged,
      onFilterChanged,
      onApplyClick,
      className,
      ...rest
    },
    ref
  ) => {
    const sortSelectId = useId()
    const panelBaseId = useId()

    const sortDirectionLabel = sortState?.isAscending
      ? commonStrings.ui.sortAsc
      : commonStrings.ui.sortDesc

    return (
      <div
        ref={ref}
        className={cn(
          'w-full max-w-core-form rounded-xl border border-border bg-surface p-4 shadow-md flex flex-col gap-4 max-h-[480px] overflow-y-auto',
          className
        )}
        {...rest}
      >
        {config.sortOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor={sortSelectId}
              className="text-sm font-semibold text-surface-foreground"
            >
              {sortDirectionLabel}
            </label>
            <div className="flex items-center gap-2">
              <select
                id={sortSelectId}
                value={sortState?.optionId ?? config.sortOptions[0]?.id}
                onChange={(e) =>
                  onSortChanged({
                    optionId: e.target.value,
                    isAscending: sortState?.isAscending ?? false
                  })
                }
                className="flex-1 h-core-button rounded-lg border border-border bg-surface px-3 text-sm"
              >
                {config.sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() =>
                  onSortChanged({
                    optionId: sortState?.optionId ?? config.sortOptions[0]?.id ?? '',
                    isAscending: !(sortState?.isAscending ?? false)
                  })
                }
                className="px-3 h-core-button rounded-lg border border-border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
              >
                {sortState?.isAscending
                  ? commonStrings.ui.sortAsc
                  : commonStrings.ui.sortDesc}
              </button>
            </div>
          </div>
        )}

        {config.filters.length > 0 && (
          <div className="flex flex-col gap-4">
            {config.filters.map((filter) => {
              const currentState = filterStates[filter.id]

              switch (filter.type) {
                case 'text': {
                  const textVal = currentState?.type === 'text' ? currentState.value : ''
                  return (
                    <div key={filter.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        {textVal && (
                          <div className="ml-auto mb-1">
                            <CoreTextButton
                              label={commonStrings.ui.clearAll}
                              onClick={() => onFilterChanged(filter.id, null)}
                              className="h-6 text-xs w-auto px-1"
                            />
                          </div>
                        )}
                      </div>
                      <CoreOutlinedTextField
                        label={filter.title}
                        placeholder={filter.placeholder}
                        value={textVal}
                        onChange={(e) => {
                          const val = e.target.value
                          if (!val) {
                            onFilterChanged(filter.id, null)
                          } else {
                            onFilterChanged(filter.id, { type: 'text', value: val })
                          }
                        }}
                      />
                    </div>
                  )
                }

                case 'number': {
                  const numVal = currentState?.type === 'number' ? currentState.value : ''
                  return (
                    <div key={filter.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        {numVal !== '' && (
                          <div className="ml-auto mb-1">
                            <CoreTextButton
                              label={commonStrings.ui.clearAll}
                              onClick={() => onFilterChanged(filter.id, null)}
                              className="h-6 text-xs w-auto px-1"
                            />
                          </div>
                        )}
                      </div>
                      <CoreOutlinedTextField
                        type="number"
                        label={filter.title}
                        placeholder={filter.placeholder}
                        value={numVal}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === '') {
                            onFilterChanged(filter.id, null)
                          } else {
                            const parsed = Number(val)
                            if (!isNaN(parsed)) {
                              onFilterChanged(filter.id, { type: 'number', value: parsed })
                            }
                          }
                        }}
                      />
                    </div>
                  )
                }

                case 'boolean': {
                  const boolVal = currentState?.type === 'boolean' ? currentState.value : null
                  const checkboxId = `${panelBaseId}_bool_${filter.id}`
                  return (
                    <div key={filter.id} className="flex items-center justify-between py-1">
                      <label htmlFor={checkboxId} className="text-sm font-medium text-surface-foreground cursor-pointer">
                        {filter.title}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id={checkboxId}
                          type="checkbox"
                          checked={boolVal === true}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onFilterChanged(filter.id, { type: 'boolean', value: true })
                            } else {
                              onFilterChanged(filter.id, null)
                            }
                          }}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>
                    </div>
                  )
                }

                case 'choice': {
                  const choiceSet =
                    currentState?.type === 'choice'
                      ? new Set(currentState.selectedIds)
                      : new Set<string>()

                  return (
                    <ListingChoiceDropdown
                      key={filter.id}
                      filter={filter}
                      selectedIds={choiceSet}
                      onSelectionChanged={(newSet) => {
                        if (newSet.size === 0) {
                          onFilterChanged(filter.id, null)
                        } else {
                          onFilterChanged(filter.id, {
                            type: 'choice',
                            selectedIds: newSet
                          })
                        }
                      }}
                    />
                  )
                }
              }
            })}
          </div>
        )}

        <CoreButton onClick={onApplyClick} label={commonStrings.ui.apply} />
      </div>
    )
  }
)

ListingOptionsPanel.displayName = 'ListingOptionsPanel'
