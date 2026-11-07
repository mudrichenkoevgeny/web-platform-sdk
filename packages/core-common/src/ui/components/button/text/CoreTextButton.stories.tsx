import type { Meta, StoryObj } from '@storybook/react'
import { CoreTextButton } from '@/ui/components/button/text/CoreTextButton'

const meta: Meta<typeof CoreTextButton> = {
  title: 'Core/Button/CoreTextButton',
  component: CoreTextButton,
  args: {
    label: 'Cancel'
  }
}

export default meta
type Story = StoryObj<typeof CoreTextButton>

export const Default: Story = {}
