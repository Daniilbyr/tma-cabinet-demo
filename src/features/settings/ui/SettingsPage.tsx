import { useNavigate } from 'react-router-dom'
import { useTma } from '@/shared/lib/tma/useTma'
import { useTelegramBackButton } from '@/widgets/back-button/useTelegramBackButton'
import styles from './SettingsPage.module.scss'

export function SettingsPage() {
  const navigate = useNavigate()
  const { theme, version, platform } = useTma()

  useTelegramBackButton(() => navigate('/'))

  const toggleMockTheme = () => {
    window.__TMA_MOCK_API__?.toggleColorScheme()
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Настройки</h1>

      <section className={styles.card} aria-labelledby="env-heading">
        <h2 id="env-heading" className={styles.cardTitle}>
          Окружение
        </h2>
        <div className={styles.row}>
          <span>Схема</span>
          <strong>{theme.scheme}</strong>
        </div>
        <div className={styles.row}>
          <span>Платформа</span>
          <strong>{platform}</strong>
        </div>
        <div className={styles.row}>
          <span>Версия WebApp</span>
          <strong>{version}</strong>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="dev-heading">
        <h2 id="dev-heading" className={styles.cardTitle}>
          Разработка
        </h2>
        <p className={styles.muted}>
          В браузерном моке можно переключить светлую/тёмную тему — эмулируется событие{' '}
          <code>themeChanged</code> для подписки через <code>useSyncExternalStore</code>.
        </p>
        <div className={styles.row} style={{ marginTop: 12 }}>
          <span>Тема (мок)</span>
          <button
            type="button"
            className={styles.btn}
            onClick={toggleMockTheme}
            disabled={!window.__TMA_MOCK_API__}
          >
            Переключить
          </button>
        </div>
        {!window.__TMA_MOCK_API__ ? (
          <p className={styles.muted}>Доступно только вне клиента Telegram.</p>
        ) : null}
      </section>
    </div>
  )
}
