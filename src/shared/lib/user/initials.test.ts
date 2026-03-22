import { describe, expect, it } from 'vitest'
import { getUserInitials } from './initials'

describe('getUserInitials', () => {
  it('returns two letters when both names exist', () => {
    expect(getUserInitials('Даниил', 'Иванов')).toBe('ДИ')
  })

  it('returns one letter when last name missing', () => {
    expect(getUserInitials('Anna')).toBe('A')
  })
})
