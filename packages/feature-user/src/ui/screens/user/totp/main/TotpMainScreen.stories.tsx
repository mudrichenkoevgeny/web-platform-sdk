import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivate, TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { TotpMainScreen } from '@/ui/screens/user/totp/main/TotpMainScreen'
import { totpMainDependenciesMock } from '@/mock/ui/screen/user/totp/main/totp-main-component-mock'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'

const meta: Meta<typeof TotpMainScreen> = {
  title: 'Feature/User/Main/TOTP/Main/TotpMainScreen',
  component: TotpMainScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-full max-w-md h-[36rem] border rounded-xl overflow-hidden bg-background">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: totpMainDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof TotpMainScreen>

export const Disabled: Story = {}

export const Enabled: Story = {
  args: {
    dependencies: (() => {
      const deps = totpMainDependenciesMock()
      const userRepository = new UserRepositoryMock()
      userRepository.emit(createTestUserPrivate({
        id: toUserIdOrThrow(TEST_USER_ID),
        isTotpEnabled: true
      }))
      deps.userRepository = userRepository
      return deps
    })()
  }
}
