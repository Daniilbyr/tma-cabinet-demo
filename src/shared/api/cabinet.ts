export type SubscriptionTier = 'free' | 'pro' | 'team'

export type CabinetProfileDto = {
  userId: number
  balanceRub: number
  subscription: SubscriptionTier
  renewsAt: string | null
}

const DEMO_DELAY_MS = 480

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Имитация REST-запроса к бэкенду кабинета. В бою сюда подставляется fetch/axios + валидация initData на сервере.
 */
export async function fetchCabinetProfile(userId: number): Promise<CabinetProfileDto> {
  await delay(DEMO_DELAY_MS)
  if (import.meta.env.VITE_API_FAIL === '1') {
    throw new Error('Симулированная ошибка API')
  }
  return {
    userId,
    balanceRub: 1250,
    subscription: 'pro',
    renewsAt: new Date(Date.now() + 86400000 * 14).toISOString(),
  }
}
