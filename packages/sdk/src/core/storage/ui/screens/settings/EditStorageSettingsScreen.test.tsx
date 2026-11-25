import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditStorageSettingsScreen } from './EditStorageSettingsScreen'

describe('EditStorageSettingsScreen', () => {
  it('renders loading state initially', async () => {
    const dependencies = {
      getSettingsUseCase: { execute: vi.fn().mockReturnValue(new Promise(() => {})) } as any,
      updateSettingsUseCase: { execute: vi.fn() } as any,
      resetSettingsUseCase: { execute: vi.fn() } as any
    }

    render(<EditStorageSettingsScreen dependencies={dependencies} />)
    const loader = await screen.findByRole('status')
    expect(loader).toBeDefined()
  })
})
