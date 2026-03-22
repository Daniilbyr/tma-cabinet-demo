import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import WebApp from '@twa-dev/sdk'
import { useTma } from './hooks/useTma'
import styles from './App.module.scss'

function initials(first: string, last?: string) {
  const a = first.trim().charAt(0).toUpperCase()
  const b = last?.trim().charAt(0).toUpperCase() ?? ''
  return (a + b).slice(0, 2)
}

function formatMoneyRub(amount: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function App() {
  const { user, theme, platform, version, initData, sendToBot } = useTma()
  const [busy, setBusy] = useState(false)

  const cssVars = useMemo(() => {
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
  }, [theme])

  useEffect(() => {
    const header = theme.params.bg_color ?? theme.params.secondary_bg_color
    if (header) WebApp.setHeaderColor(header)
    if (theme.params.bg_color) WebApp.setBackgroundColor(theme.params.bg_color)
  }, [theme.params.bg_color, theme.params.secondary_bg_color])

  const onMainPay = useCallback(() => {
    setBusy(true)
    sendToBot({ type: 'pay_subscription', planId: 'demo_pro' })
    setTimeout(() => setBusy(false), 400)
  }, [sendToBot])

  useEffect(() => {
    const mb = WebApp.MainButton
    mb.setText('Оплатить подписку')
    mb.onClick(onMainPay)
    mb.show()
    return () => {
      mb.offClick(onMainPay)
      mb.hide()
    }
  }, [onMainPay])

  useEffect(() => {
    if (busy) WebApp.MainButton.showProgress(true)
    else WebApp.MainButton.hideProgress()
  }, [busy])

  if (!user) {
    return (
      <div className={styles.shell} style={cssVars}>
        <div className={styles.card}>
          <p className={styles.title}>Нет данных пользователя</p>
          <p className={styles.sub}>
            Откройте мини-приложение из Telegram (или используйте локальный мок в{' '}
            <code>src/telegram/mock.ts</code>).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.shell} style={cssVars}>
      <div className={styles.badge}>
        <span className={styles.dot} aria-hidden />
        Личный кабинет · TMA
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.avatar} aria-hidden>
            {initials(user.firstName, user.lastName)}
          </div>
          <div>
            <h1 className={styles.title}>
              {user.firstName}
              {user.lastName ? ` ${user.lastName}` : ''}
            </h1>
            <p className={styles.sub}>
              {user.username ? `@${user.username}` : `id: ${user.id}`}
            </p>
          </div>
        </div>
        <div className={styles.meta}>
          <div>
            Платформа: <strong>{platform}</strong> · WebApp <strong>{version}</strong>
          </div>
          <div>
            initData:{' '}
            <strong>{initData ? `${initData.slice(0, 24)}…` : 'пусто (демо / без подписи)'}</strong>
          </div>
        </div>
      </div>

      <section className={styles.section} aria-labelledby="balance-heading">
        <h2 id="balance-heading" className={styles.sectionTitle}>
          Баланс и подписка
        </h2>
        <div className={styles.balanceGrid}>
          <div className={styles.pill}>
            <div className={styles.pillLabel}>Баланс</div>
            <div className={styles.pillValue}>{formatMoneyRub(1250)}</div>
          </div>
          <div className={styles.pill}>
            <div className={styles.pillLabel}>Статус</div>
            <div className={styles.pillValue} style={{ fontSize: '16px' }}>
              Pro (демо)
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="actions-heading">
        <h2 id="actions-heading" className={styles.sectionTitle}>
          Действия
        </h2>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => sendToBot({ type: 'open_support' })}
          >
            Написать в поддержку
          </button>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() =>
              WebApp.openLink('https://core.telegram.org/bots/webapps', { try_instant_view: false })
            }
          >
            Документация Telegram Web Apps
          </button>
        </div>
      </section>

      <p className={styles.hint}>
        Демо для портфолио: синхронизация темы с Telegram, MainButton, sendData в бота, адаптивная
        вёрстка. В продакшене initData проверяется на бэкенде (HMAC), здесь — только UI-паттерны.
      </p>
    </div>
  )
}
