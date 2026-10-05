import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListingChoiceDropdown } from '@/ui/components/listing/option/dropdown/ListingChoiceDropdown'
import type { ChoiceListingFilterDefinition } from '@/listing/listing-models'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('ListingChoiceDropdown', () => {
  const dummyFilter: ChoiceListingFilterDefinition = {
    type: 'choice',
    id: 'status',
    title: 'Status',
    options: [
      { id: 'active', title: 'Active' },
      { id: 'inactive', title: 'Inactive' }
    ]
  }

  it('renders title and displays selected option', async () => {
    const onSelectionChanged = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <ListingChoiceDropdown
          filter={dummyFilter}
          selectedIds={new Set(['active'])}
          onSelectionChanged={onSelectionChanged}
        />
      </ComponentTestHarness>
    )

    expect(screen.getByText('Status')).toBeDefined()
    const trigger = screen.getByDisplayValue('Active')
    await user.click(trigger)

    const inactiveOption = screen.getByText('Inactive')
    await user.click(inactiveOption)

    expect(onSelectionChanged).toHaveBeenCalledWith(new Set(['inactive']))
  })

  it('closes dropdown when clicking outside', async () => {
    const onSelectionChanged = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <div>
          <button type="button">Outside Element</button>
          <ListingChoiceDropdown
            filter={dummyFilter}
            selectedIds={new Set(['active'])}
            onSelectionChanged={onSelectionChanged}
          />
        </div>
      </ComponentTestHarness>
    )

    const trigger = screen.getByDisplayValue('Active')
    await user.click(trigger)

    expect(screen.getByText('Inactive')).toBeDefined()

    const outsideButton = screen.getByText('Outside Element')
    await user.click(outsideButton)

    expect(screen.queryByText('Inactive')).toBeNull()
  })
})
