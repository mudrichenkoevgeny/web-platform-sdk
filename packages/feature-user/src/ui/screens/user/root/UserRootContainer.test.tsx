import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { UserRootContainer } from '@/ui/screens/user/root/UserRootContainer'

describe('UserRootContainer', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <UserRootContainer onDismiss={vi.fn()}>
        <div>Test Child</div>
      </UserRootContainer>
    )

    expect(getByText('Test Child')).not.toBeNull()
  })

  it('triggers onDismiss when overlay is clicked', () => {
    const onDismiss = vi.fn()
    const { getByRole } = render(
      <UserRootContainer onDismiss={onDismiss}>
        <div>Modal Content</div>
      </UserRootContainer>
    )

    fireEvent.click(getByRole('dialog'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('triggers onDismiss when Escape key is pressed', () => {
    const onDismiss = vi.fn()
    render(
      <UserRootContainer onDismiss={onDismiss}>
        <div>Modal Content</div>
      </UserRootContainer>
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
