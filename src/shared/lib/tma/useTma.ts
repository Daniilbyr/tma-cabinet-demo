import WebApp from '@twa-dev/sdk'
import { useCallback, useEffect, useSyncExternalStore } from 'react'
import {
  mapWebAppUser,
  type TelegramWebAppUser,
} from '@/entities/user/lib/mapWebAppUser'
import type { AppUser } from '@/entities/user/model/types'
import type { TelegramThemeSnapshot } from '@/shared/lib/telegram/theme-vars'

type TmaSnapshot = {
  viewportStableHeight: number
  theme: TelegramThemeSnapshot
  initData: string
  platform: string
  version: string
}

function subscribeTma(onStoreChange: () => void) {
  const events = ['viewportChanged', 'themeChanged'] as const
  events.forEach((e) => WebApp.onEvent(e, onStoreChange))
  return () => events.forEach((e) => WebApp.offEvent(e, onStoreChange))
}

function getTmaSnapshot(): TmaSnapshot {
  return {
    viewportStableHeight: WebApp.viewportStableHeight,
    theme: {
      scheme: WebApp.colorScheme,
      params: { ...WebApp.themeParams },
    },
    initData: WebApp.initData,
    platform: WebApp.platform,
    version: WebApp.version,
  }
}

function getServerSnapshot(): TmaSnapshot {
  return {
    viewportStableHeight: 640,
    theme: {
      scheme: 'dark',
      params: {
        bg_color: '#1c1c1e',
        text_color: '#ffffff',
        secondary_bg_color: '#2c2c2e',
      },
    },
    initData: '',
    platform: 'server',
    version: '0.0',
  }
}

export function useTma() {
  useEffect(() => {
    WebApp.ready()
    WebApp.expand()
  }, [])

  const snap = useSyncExternalStore(subscribeTma, getTmaSnapshot, getServerSnapshot)

  const user: AppUser | null = mapWebAppUser(
    WebApp.initDataUnsafe.user as TelegramWebAppUser | undefined,
  )

  const sendToBot = useCallback((payload: Record<string, unknown>) => {
    WebApp.sendData(JSON.stringify(payload))
  }, [])

  const haptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    WebApp.HapticFeedback?.impactOccurred?.(type)
  }, [])

  return {
    user,
    theme: snap.theme,
    viewportStableHeight: snap.viewportStableHeight,
    platform: snap.platform,
    version: snap.version,
    initData: snap.initData,
    sendToBot,
    haptic,
    webApp: WebApp,
  }
}
