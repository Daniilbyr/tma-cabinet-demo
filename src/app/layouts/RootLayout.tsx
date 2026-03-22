import WebApp from '@twa-dev/sdk'
import { useEffect, type CSSProperties } from 'react'
import { Outlet } from 'react-router-dom'
import { useTma } from '@/shared/lib/tma/useTma'
import { telegramThemeToCssVars } from '@/shared/lib/telegram/theme-vars'
import { BottomTabBar } from '@/widgets/navigation/BottomTabBar'
import styles from './RootLayout.module.scss'

export function RootLayout() {
  const { theme } = useTma()
  const cssVars = telegramThemeToCssVars(theme) as CSSProperties

  useEffect(() => {
    const header = theme.params.bg_color ?? theme.params.secondary_bg_color
    if (header) WebApp.setHeaderColor(header as `#${string}`)
    const bg = theme.params.bg_color
    if (bg) WebApp.setBackgroundColor(bg as `#${string}`)
  }, [theme.params.bg_color, theme.params.secondary_bg_color])

  return (
    <div className={styles.root} style={cssVars}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  )
}
