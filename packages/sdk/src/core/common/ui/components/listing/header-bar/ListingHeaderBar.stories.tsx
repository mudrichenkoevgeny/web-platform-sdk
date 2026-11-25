import type { Meta, StoryObj } from '@storybook/react'
import { ListingHeaderBar } from '@/core/common/ui/components/listing/header-bar/ListingHeaderBar'

const meta: Meta<typeof ListingHeaderBar> = {
  title: 'Core/Listing/ListingHeaderBar',
  component: ListingHeaderBar,
  args: {
    onRefreshClick: () => undefined,
    onOptionsClick: () => undefined
  }
}

export default meta
type Story = StoryObj<typeof ListingHeaderBar>

export const Default: Story = {}
