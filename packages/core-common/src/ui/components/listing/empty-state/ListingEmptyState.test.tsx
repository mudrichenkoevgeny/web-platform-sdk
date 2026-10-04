import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingEmptyState } from '@/ui/components/listing/empty-state/ListingEmptyState'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('ListingEmptyState', () => {
  it('renders default empty list message', () => {
    render(
      <ComponentTestHarness>
        <ListingEmptyState />
      </ComponentTestHarness>
    )

    expect(screen.getByText('No items found')).toBeDefined()
  })

  it('renders custom empty list message', () => {
    render(
      <ComponentTestHarness>
        <ListingEmptyState text="No users found" />
      </ComponentTestHarness>
    )

    expect(screen.getByText('No users found')).toBeDefined()
  })
})
