import { useQuery } from '@tanstack/react-query'
import WebApp from '@twa-dev/sdk'
import { useCallback, useState } from 'react'
import { fetchCabinetProfile } from '@/shared/api/cabinet'
import { formatMoneyRub } from '@/shared/lib/format/money'
import { formatRenewalDate, subscriptionLabel } from '@/shared/lib/format/subscription'
import { useTma } from '@/shared/lib/tma/useTma'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { useMainButton } from '@/widgets/main-button/useMainButton'
import { getUserInitials } from '@/shared/lib/user/initials'
import { NoUserView } from '@/features/misc/ui/NoUserView'
import styles from './CabinetPage.module.scss'

export function CabinetPage() {
  const { user, initData, platform, version, sendToBot, haptic } = useTma()
  const [paying, setPaying] = useState(false)

  const query = useQuery({
    queryKey: ['cabinet', user?.id ?? 0],
    queryFn: () => fetchCabinetProfile(user!.id),
    enabled: Boolean(user),
  })

  const onPay = useCallback(async () => {
    haptic('medium')
    setPaying(true)
    WebApp.MainButton.showProgress(true)
    try {
      sendToBot({ type: 'pay_subscription', planId: 'demo_pro', ts: Date.now() })
      await new Promise((r) => setTimeout(r, 450))
    } finally {
      WebApp.MainButton.hideProgress()
      setPaying(false)
    }
  }, [haptic, sendToBot])

  useMainButton({
    text: 'Оплатить подписку',
    visible: Boolean(user && query.isSuccess),
    disabled: paying || query.isFetching,
    onPress: onPay,
  })

  if (!user) {
    return <NoUserView />
  }

  return (
    <div className={styles.shell}>
      <div className={styles.badge}>
        <span className={styles.dot} aria-hidden />
        Личный кабинет · TMA
      </div>

      {query.isPending ? (
        <>
          <Skeleton className={styles.skeletonCard} aria-label="Загрузка профиля" />
          <div className={styles.section}>
            <Skeleton className={styles.skeletonRow} aria-label="Загрузка данных" />
          </div>
        </>
      ) : null}

      {query.isError ? (
        <div className={styles.errorBox} role="alert">
          <strong>Не удалось загрузить кабинет</strong>
          <div className={styles.renew}>
            {query.error instanceof Error ? query.error.message : 'Неизвестная ошибка'}
          </div>
          <button type="button" className={styles.btnPrimary} onClick={() => query.refetch()}>
            Повторить
          </button>
        </div>
      ) : null}

      {query.isSuccess ? (
        <>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.avatar} aria-hidden>
                {getUserInitials(user.firstName, user.lastName)}
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
                <strong>
                  {initData ? `${initData.slice(0, 24)}…` : 'пусто (демо / без подписи)'}
                </strong>
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
                <div className={styles.pillValue}>{formatMoneyRub(query.data.balanceRub)}</div>
              </div>
              <div className={styles.pill}>
                <div className={styles.pillLabel}>Тариф</div>
                <div className={styles.pillValue} style={{ fontSize: '17px' }}>
                  {subscriptionLabel(query.data.subscription)}
                </div>
              </div>
            </div>
            {formatRenewalDate(query.data.renewsAt) ? (
              <p className={styles.renew}>Продление: {formatRenewalDate(query.data.renewsAt)}</p>
            ) : null}
          </section>

          <section className={styles.section} aria-labelledby="actions-heading">
            <h2 id="actions-heading" className={styles.sectionTitle}>
              Действия
            </h2>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  haptic('light')
                  sendToBot({ type: 'open_support' })
                }}
              >
                Написать в поддержку
              </button>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() =>
                  WebApp.openLink('https://core.telegram.org/bots/webapps', {
                    try_instant_view: false,
                  })
                }
              >
                Документация Telegram Web Apps
              </button>
            </div>
          </section>

          <p className={styles.hint}>
            Архитектура: TanStack Query для данных кабинета, хуки для MainButton/темы, маршрутизация,
            Error Boundary. В продакшене initData валидируется на сервере (HMAC); здесь — клиентские
            паттерны и UX.
          </p>
        </>
      ) : null}
    </div>
  )
}
