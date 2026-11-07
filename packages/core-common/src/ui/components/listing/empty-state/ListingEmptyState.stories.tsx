import type { Meta, StoryObj } from '@storybook/react'
import { ListingEmptyState } from '@/ui/components/listing/empty-state/ListingEmptyState'

const meta: Meta<typeof ListingEmptyState> = {
  title: 'Core/Listing/ListingEmptyState',
  component: ListingEmptyState
}

export default meta
type Story = StoryObj<typeof ListingEmptyState>

export const Default: Story = {}
