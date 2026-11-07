import type { Meta, StoryObj } from '@storybook/react'
import { PagingFooter } from '@/ui/components/listing/paging-footer/PagingFooter'

const meta: Meta<typeof PagingFooter> = {
  title: 'Core/Listing/PagingFooter',
  component: PagingFooter,
  args: {
    currentPage: 1,
    totalPages: 10,
    totalCount: 100,
    onPageChange: () => undefined
  }
}

export default meta
type Story = StoryObj<typeof PagingFooter>

export const Default: Story = {}
