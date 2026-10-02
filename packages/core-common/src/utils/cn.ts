import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function combining conditional class names via clsx and merging Tailwind CSS classes via tailwind-merge.
 *
 * @param inputs - Variadic list of class values or conditional class objects
 * @returns Merged Tailwind class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
