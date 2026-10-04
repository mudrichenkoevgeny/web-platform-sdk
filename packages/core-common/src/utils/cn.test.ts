import { describe, it, expect } from 'vitest'
import { cn } from '@/utils/cn'

describe('cn utility', () => {
  it('combines class names', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center')
  })

  it('handles conditional class names', () => {
    expect(cn('flex', false && 'hidden', true && 'p-4')).toBe('flex p-4')
  })

  it('merges tailwind conflicts correctly', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
