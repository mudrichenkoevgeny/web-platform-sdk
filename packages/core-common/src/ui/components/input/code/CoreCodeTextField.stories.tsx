import type { Meta, StoryObj } from '@storybook/react'
import { CoreCodeTextField } from './CoreCodeTextField'

const meta: Meta<typeof CoreCodeTextField> = {
  title: 'Core/Input/CoreCodeTextField',
  component: CoreCodeTextField,
  args: {
    placeholder: '123456'
  }
}

export default meta
type Story = StoryObj<typeof CoreCodeTextField>

export const Default: Story = {}
