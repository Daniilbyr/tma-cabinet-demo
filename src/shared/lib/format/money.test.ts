import { describe, expect, it } from 'vitest'
import { formatMoneyRub } from './money'

describe('formatMoneyRub', () => {
  it('formats integer rub amounts', () => {
    expect(formatMoneyRub(1250)).toMatch(/1[\s\u00a0]?250/)
  })
})
