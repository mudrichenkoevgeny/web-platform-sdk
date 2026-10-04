import type { Meta, StoryObj } from '@storybook/react'
import { CoreBackButton } from '@/ui/components/button/back/CoreBackButton'

const meta: Meta<typeof CoreBackButton> = {
  title: 'Core/Button/CoreBackButton',
  component: CoreBackButton,
  args: {
    onClick: () => undefined
  }
}

export default meta
type Story = StoryObj<typeof CoreBackButton>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
