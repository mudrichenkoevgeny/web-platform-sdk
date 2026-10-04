import React, { forwardRef, useId } from 'react'
import type {
  ListingOptionsConfig,
  ListingSortState,
  ListingFilterState
} from '@/listing/ListingModels'
import { CoreButton } from '@/ui/components/button/button/CoreButton'
import { ListingChoiceDropdown } from '@/dropdown/ListingChoiceDropdown'
import { CoreOutlinedTextField } from '@/ui/components/input/outlined/CoreOutlinedTextField'
import { CoreTextButton } from '@/ui/components/button/text/CoreTextButton'
import { enStrings } from '@/locales/en/strings'
import { cn } from '@/utils/cn'

export interface ListingOptionsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ListingOptionsConfig
  sortState: ListingSortState | null
  filterStates: Record<string, ListingFilterState>
  onSortChanged: (sortState: ListingSortState) => void
  onFilterChanged: (filterId: string, newState: ListingFilterState | null) => void
  onApplyClick: () => void
}

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
              {enStrings.ui_common_status}
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
                    isAscending: !sortState?.isAscending
                  })
                }
                className="px-3 h-core-button rounded-lg border border-border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
              >
                {sortState?.isAscending
                  ? enStrings.ui_common_sort_asc
                  : enStrings.ui_common_sort_desc}
              </button>
            </div>
          </div>
        )}

        {config.filters.length > 0 && (
          <div className="flex flex-col gap-4">
            {config.filters.map((filter) => {
              const currentState = filterStates[filter.id]

              if (filter.type === 'text') {
                const textVal = currentState?.type === 'text' ? currentState.value : ''
                return (
                  <div key={filter.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      {textVal && (
                        <div className="ml-auto mb-1">
                          <CoreTextButton
                            label={enStrings.ui_common_clear_all}
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

              if (filter.type === 'choice') {
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

              return null
            })}
          </div>
        )}

        <CoreButton onClick={onApplyClick} label={enStrings.ui_common_apply} />
      </div>
    )
  }
)

ListingOptionsPanel.displayName = 'ListingOptionsPanel'
