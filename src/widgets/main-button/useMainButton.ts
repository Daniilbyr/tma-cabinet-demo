import WebApp from '@twa-dev/sdk'
import { useEffect, useLayoutEffect, useRef } from 'react'

type Options = {
  text: string
  visible: boolean
  onPress: () => void | Promise<void>
  disabled?: boolean
}

/**
 * Жизненный цикл нижней кнопки Telegram: текст, видимость, подписка, снятие при размонтировании.
 */
export function useMainButton({ text, visible, onPress, disabled }: Options) {
  const onPressRef = useRef(onPress)
  useLayoutEffect(() => {
    onPressRef.current = onPress
  }, [onPress])

  useEffect(() => {
    const mb = WebApp.MainButton
    const handler = () => {
      void onPressRef.current()
    }

    mb.setText(text)

    if (!visible) {
      mb.hide()
      mb.hideProgress()
      return
    }

    mb.onClick(handler)
    mb.show()

    return () => {
      mb.offClick(handler)
      mb.hide()
      mb.hideProgress()
    }
  }, [text, visible])

  useEffect(() => {
    const mb = WebApp.MainButton
    if (!visible) return
    if (disabled) mb.disable()
    else mb.enable()
  }, [disabled, visible])
}
