import type { SubscriptionTier } from '@/shared/api/cabinet'

export function subscriptionLabel(tier: SubscriptionTier): string {
  const map: Record<SubscriptionTier, string> = {
    free: 'Free',
    pro: 'Pro',
    team: 'Team',
  }
  return map[tier]
}

export function formatRenewalDate(iso: string | null): string | null {
  if (!iso) return null
  try {
    return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(iso))
  } catch {
    return null
  }
}
