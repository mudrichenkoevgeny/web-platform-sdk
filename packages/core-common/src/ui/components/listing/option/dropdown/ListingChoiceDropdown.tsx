import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react'
import { ChoiceListingFilterDefinition } from '../../../../../listing/ListingModels'
import { CoreTextButton } from '../../../button/text/CoreTextButton'
import { CoreOutlinedTextField } from '../../../input/outlined/CoreOutlinedTextField'
import { enStrings } from '../../../../../locales/en/strings'
import { cn } from '../../../../../utils/cn'

export interface ListingChoiceDropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  filter: ChoiceListingFilterDefinition
  selectedIds: Set<string>
  onSelectionChanged: (selectedIds: Set<string>) => void
}

export const ListingChoiceDropdown = forwardRef<HTMLDivElement, ListingChoiceDropdownProps>(
  ({ filter, selectedIds, onSelectionChanged, className, ...rest }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    useEffect(() => {
      if (!isExpanded) {
        return
      }

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
    let displayValue = enStrings.ui_common_all

    if (selectedOptions.length === 1) {
      displayValue = selectedOptions[0]?.title ?? ''
    } else if (selectedOptions.length === 2) {
      displayValue = selectedOptions.map((opt) => opt.title).join(', ')
    } else if (selectedOptions.length > 2) {
      displayValue = enStrings.ui_common_selected_count(selectedOptions.length)
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
                placeholder={enStrings.ui_common_search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-sm"
              />
            )}

            {filter.isMultiple && filter.options.length > 3 && (
              <div className="flex items-center justify-between px-2">
                <CoreTextButton label={enStrings.ui_common_select_all} onClick={handleSelectAll} className="h-6 text-xs w-auto px-2" />
                <CoreTextButton label={enStrings.ui_common_clear_all} onClick={handleClearAll} className="h-6 text-xs w-auto px-2" />
              </div>
            )}

            <div className="flex flex-col gap-1">
              {filteredOptions.map((option) => {
                const isSelected = selectedIds.has(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionToggle(option.id)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <input
                      type={filter.isMultiple ? 'checkbox' : 'radio'}
                      checked={isSelected}
                      readOnly
                      tabIndex={-1}
                      className="pointer-events-none"
                    />
                    <span>{option.title}</span>
                  </button>
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
