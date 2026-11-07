import type { Meta, StoryObj } from '@storybook/react'
import { CoreScreenTitleText } from '@/ui/components/text/screen-title/CoreScreenTitleText'

const meta: Meta<typeof CoreScreenTitleText> = {
  title: 'Core/Text/CoreScreenTitleText',
  component: CoreScreenTitleText,
  args: {
    text: 'Screen Title'
  }
}

export default meta
type Story = StoryObj<typeof CoreScreenTitleText>

export const Default: Story = {}
