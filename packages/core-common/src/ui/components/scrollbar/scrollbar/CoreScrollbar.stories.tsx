import type { Meta, StoryObj } from '@storybook/react'
import { CoreVerticalScrollbar } from '@/ui/components/scrollbar/scrollbar/CoreScrollbar'

const meta: Meta<typeof CoreVerticalScrollbar> = {
  title: 'Core/Scrollbar/CoreVerticalScrollbar',
  component: CoreVerticalScrollbar
}

export default meta
type Story = StoryObj<typeof CoreVerticalScrollbar>

export const NativeWebScrollbarExample: Story = {
  render: () => (
    <div className="h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-border border p-2">
      <div className="h-96 space-y-2">
        <p>Item 1</p>
        <p>Item 2</p>
        <p>Item 3</p>
        <p>Item 4</p>
        <p>Item 5</p>
      </div>
      <CoreVerticalScrollbar />
    </div>
  )
}
