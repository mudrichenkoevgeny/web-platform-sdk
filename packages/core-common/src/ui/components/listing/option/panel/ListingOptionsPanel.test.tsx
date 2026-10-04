import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListingOptionsPanel } from './ListingOptionsPanel'
import { ListingOptionsConfig } from '@/listing/ListingModels'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('ListingOptionsPanel', () => {
  const dummyConfig: ListingOptionsConfig = {
    sortOptions: [
      { id: 'created_at', title: 'Created Date' }
    ],
    filters: [
      { type: 'text', id: 'action', title: 'Action', placeholder: 'Search action...' }
    ]
  }

  it('renders sort and filter options and handles apply click', async () => {
    const onApplyClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <ListingOptionsPanel
          config={dummyConfig}
          sortState={{ optionId: 'created_at', isAscending: true }}
          filterStates={{}}
          onSortChanged={() => undefined}
          onFilterChanged={() => undefined}
          onApplyClick={onApplyClick}
        />
      </ComponentTestHarness>
    )

    expect(screen.getByText('Created Date')).toBeDefined()
    const applyButton = screen.getByText('Apply')
    await user.click(applyButton)

    expect(onApplyClick).toHaveBeenCalledTimes(1)
  })
})
