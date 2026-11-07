import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockSuccessScreen } from '@/ui/screens/auth/unlock/success/UnlockSuccessScreen'

const meta: Meta<typeof UnlockSuccessScreen> = {
  title: 'Feature/User/Auth/Unlock/Success/UnlockSuccessScreen',
  component: UnlockSuccessScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-dialog-default h-dialog-default border rounded-xl overflow-hidden">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    onFinished: () => {}
  }
}

export default meta
type Story = StoryObj<typeof UnlockSuccessScreen>

export const Default: Story = {}
