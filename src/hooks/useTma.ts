import { useCallback, useEffect, useMemo, useState } from 'react'
import WebApp from '@twa-dev/sdk'

export type TmaUser = {
  id: number
  firstName: string
  lastName?: string
  username?: string
  languageCode?: string
}

export function useTma() {
  const [viewportH, setViewportH] = useState(WebApp.viewportStableHeight)

  useEffect(() => {
    WebApp.ready()
    WebApp.expand()

    const onVp = () => setViewportH(WebApp.viewportStableHeight)
    WebApp.onEvent('viewportChanged', onVp)
    return () => WebApp.offEvent('viewportChanged', onVp)
  }, [])

  const user = useMemo((): TmaUser | null => {
    const u = WebApp.initDataUnsafe.user
    if (!u) return null
    return {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      username: u.username,
      languageCode: u.language_code,
    }
  }, [])

  const theme = useMemo(
    () => ({
      scheme: WebApp.colorScheme,
      params: WebApp.themeParams,
    }),
    [],
  )

  const sendToBot = useCallback((payload: Record<string, unknown>) => {
    WebApp.sendData(JSON.stringify(payload))
  }, [])

  return {
    user,
    theme,
    viewportStableHeight: viewportH,
    platform: WebApp.platform,
    version: WebApp.version,
    initData: WebApp.initData,
    sendToBot,
    webApp: WebApp,
  }
}
