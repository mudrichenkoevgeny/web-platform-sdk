import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle, useId } from 'react'
import { commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ChoiceListingFilterDefinition } from '@/listing/listing-models'
import { CoreTextButton } from '@/ui/components/button/text/CoreTextButton'
import { CoreOutlinedTextField } from '@/ui/components/input/outlined/CoreOutlinedTextField'
import { cn } from '@/utils/cn'

/** Props for {@link ListingChoiceDropdown}. */
export interface ListingChoiceDropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Choice filter definition containing option list and selection settings. */
  filter: ChoiceListingFilterDefinition
  /** Set of currently selected option IDs. */
  selectedIds: Set<string>
  /** Callback triggered when option selection is modified. */
  onSelectionChanged: (selectedIds: Set<string>) => void
}

/**
 * Dropdown selector component for single or multiple choice listing filters.
 */
export const ListingChoiceDropdown = forwardRef<HTMLDivElement, ListingChoiceDropdownProps>(
  ({ filter, selectedIds, onSelectionChanged, className, ...rest }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownBaseId = useId()

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    useEffect(() => {
      if (!isExpanded) {
        return
      }

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (
          event.target instanceof Node &&
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsExpanded(false)
        }
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsExpanded(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchstart', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [isExpanded])

    const selectedOptions = filter.options.filter((opt) => selectedIds.has(opt.id))
    let displayValue = commonStrings.ui.all

    if (selectedOptions.length === 1) {
      displayValue = selectedOptions[0]?.title ?? ''
    } else if (selectedOptions.length === 2) {
      displayValue = selectedOptions.map((opt) => opt.title).join(', ')
    } else if (selectedOptions.length > 2) {
      displayValue = commonStrings.ui.selectedCount(selectedOptions.length)
    }

    const filteredOptions = searchQuery.trim().length === 0
      ? filter.options
      : filter.options.filter((opt) => opt.title.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleOptionToggle = (optionId: string) => {
      if (filter.isMultiple) {
        const nextSet = new Set(selectedIds)
        if (nextSet.has(optionId)) {
          nextSet.delete(optionId)
        } else {
          nextSet.add(optionId)
        }
        onSelectionChanged(nextSet)
      } else {
        onSelectionChanged(new Set([optionId]))
        setIsExpanded(false)
        setSearchQuery('')
      }
    }

    const handleSelectAll = () => {
      onSelectionChanged(new Set(filter.options.map((opt) => opt.id)))
    }

    const handleClearAll = () => {
      onSelectionChanged(new Set())
    }

    return (
      <div ref={containerRef} className={cn('relative w-full', className)} {...rest}>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-haspopup="listbox"
          className="w-full text-left cursor-pointer focus:outline-none"
        >
          <CoreOutlinedTextField
            label={filter.title}
            value={displayValue}
            readOnly
            tabIndex={-1}
            className="cursor-pointer pointer-events-none"
            trailingIcon={
              <svg className={cn('w-4 h-4 transition-transform', isExpanded ? 'rotate-180' : '')} viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
            }
          />
        </button>

        {isExpanded && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-surface border border-border rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto flex flex-col gap-2">
            {(filter.isSearchable || filter.options.length > 8) && (
              <CoreOutlinedTextField
                placeholder={commonStrings.ui.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-sm"
              />
            )}

            {filter.isMultiple && filter.options.length > 3 && (
              <div className="flex items-center justify-between px-2">
                <CoreTextButton label={commonStrings.ui.selectAll} onClick={handleSelectAll} className="h-6 text-xs w-auto px-2" />
                <CoreTextButton label={commonStrings.ui.clearAll} onClick={handleClearAll} className="h-6 text-xs w-auto px-2" />
              </div>
            )}

            <div className="flex flex-col gap-1">
              {filteredOptions.map((option) => {
                const isSelected = selectedIds.has(option.id)
                const optionInputId = `${dropdownBaseId}_opt_${option.id}`
                return (
                  <div
                    key={option.id}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <input
                      id={optionInputId}
                      type={filter.isMultiple ? 'checkbox' : 'radio'}
                      checked={isSelected}
                      onChange={() => handleOptionToggle(option.id)}
                      className="cursor-pointer"
                    />
                    <label htmlFor={optionInputId} className="flex-1 cursor-pointer select-none">
                      {option.title}
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
)

ListingChoiceDropdown.displayName = 'ListingChoiceDropdown'
