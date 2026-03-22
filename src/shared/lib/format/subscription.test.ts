import { describe, expect, it } from 'vitest'
import { formatRenewalDate, subscriptionLabel } from './subscription'

describe('subscriptionLabel', () => {
  it('maps tiers', () => {
    expect(subscriptionLabel('pro')).toBe('Pro')
  })
})

describe('formatRenewalDate', () => {
  it('returns null for empty', () => {
    expect(formatRenewalDate(null)).toBeNull()
  })
})
