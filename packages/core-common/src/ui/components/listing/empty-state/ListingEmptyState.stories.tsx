import type { Meta, StoryObj } from '@storybook/react'
import { ListingEmptyState } from './ListingEmptyState'

const meta: Meta<typeof ListingEmptyState> = {
  title: 'Core/Listing/ListingEmptyState',
  component: ListingEmptyState
}

export default meta
type Story = StoryObj<typeof ListingEmptyState>

export const Default: Story = {}
