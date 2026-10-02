import type { Meta, StoryObj } from '@storybook/react'
import { CoreButton } from './CoreButton'

const meta: Meta<typeof CoreButton> = {
  title: 'Core/Button/CoreButton',
  component: CoreButton,
  args: {
    label: 'Submit'
  }
}

export default meta
type Story = StoryObj<typeof CoreButton>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    isLoading: true
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
