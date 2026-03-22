import type { CSSProperties } from 'react'

export type TelegramThemeSnapshot = {
  scheme: 'light' | 'dark'
  params: Record<string, string | undefined>
}

export function telegramThemeToCssVars(theme: TelegramThemeSnapshot): CSSProperties {
  const p = theme.params
  const bg = p.bg_color ?? '#0f0f12'
  const text = p.text_color ?? '#f4f4f5'
  const hint = p.hint_color ?? '#a1a1aa'
  const btn = p.button_color ?? '#22c55e'
  const btnText = p.button_text_color ?? '#052e16'
  const secondary = p.secondary_bg_color ?? '#18181b'
  const link = p.link_color ?? '#60a5fa'
  return {
    '--bg': bg,
    '--text': text,
    '--muted': hint,
    '--accent': btn,
    '--accent-text': btnText,
    '--secondary-bg': secondary,
    '--card-bg': theme.scheme === 'dark' ? secondary : '#ffffff',
    '--border': theme.scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    '--link': link,
    backgroundColor: bg,
    color: text,
  } as CSSProperties
}
