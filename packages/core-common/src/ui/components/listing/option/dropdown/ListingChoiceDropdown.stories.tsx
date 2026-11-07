import type { Meta, StoryObj } from '@storybook/react'
import { ListingChoiceDropdown } from '@/ui/components/listing/option/dropdown/ListingChoiceDropdown'

const meta: Meta<typeof ListingChoiceDropdown> = {
  title: 'Core/Listing/ListingChoiceDropdown',
  component: ListingChoiceDropdown,
  args: {
    filter: {
      type: 'choice',
      id: 'status',
      title: 'Status',
      options: [
        { id: 'active', title: 'Active' },
        { id: 'inactive', title: 'Inactive' }
      ]
    },
    selectedIds: new Set(['active']),
    onSelectionChanged: () => undefined
  }
}

export default meta
type Story = StoryObj<typeof ListingChoiceDropdown>

export const Default: Story = {}
