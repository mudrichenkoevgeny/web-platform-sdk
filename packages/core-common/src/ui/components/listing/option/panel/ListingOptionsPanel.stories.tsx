import type { Meta, StoryObj } from '@storybook/react'
import { ListingOptionsPanel } from './ListingOptionsPanel'

const meta: Meta<typeof ListingOptionsPanel> = {
  title: 'Core/Listing/ListingOptionsPanel',
  component: ListingOptionsPanel,
  args: {
    config: {
      sortOptions: [
        { id: 'created_at', title: 'Created Date' }
      ],
      filters: [
        { type: 'text', id: 'action', title: 'Action', placeholder: 'Search action...' }
      ]
    },
    sortState: { optionId: 'created_at', isAscending: true },
    filterStates: {},
    onSortChanged: () => undefined,
    onFilterChanged: () => undefined,
    onApplyClick: () => undefined
  }
}

export default meta
type Story = StoryObj<typeof ListingOptionsPanel>

export const Default: Story = {}
