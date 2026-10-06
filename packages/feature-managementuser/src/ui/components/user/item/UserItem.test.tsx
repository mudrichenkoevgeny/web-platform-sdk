import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserItem } from '@/ui/components/user/item/UserItem'
import { enManagementUserStrings } from '@/locales/index'

describe('UserItem', () => {
  it('renders user details and handles click', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    const userDetails = userDetailsMock()

    render(
      <ComponentTestHarness>
        <UserItem user={userDetails} onClick={onClick} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(enManagementUserStrings.user_id(userDetails.id))).toBeDefined()
    expect(screen.getByText(`${enManagementUserStrings.user_role}: ${userDetails.role}`)).toBeDefined()
    expect(screen.getByText(`${enManagementUserStrings.user_account_status}: ${userDetails.accountStatus}`)).toBeDefined()

    const item = screen.getByTestId(`UserItem_${userDetails.id}`)
    await user.click(item)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
