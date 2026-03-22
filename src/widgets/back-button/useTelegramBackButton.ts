import WebApp from '@twa-dev/sdk'
import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Показ системной кнопки «Назад» в TMA и маршрут назад.
 */
export function useTelegramBackButton(onBack: () => void, enabled = true) {
  const onBackRef = useRef(onBack)
  useLayoutEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  useEffect(() => {
    if (!enabled) return
    const bb = WebApp.BackButton
    const handler = () => onBackRef.current()
    bb.onClick(handler)
    bb.show()
    return () => {
      bb.offClick(handler)
      bb.hide()
    }
  }, [enabled])
}
