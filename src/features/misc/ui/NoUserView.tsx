import styles from './NoUserView.module.scss'

export function NoUserView() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.title}>Нет данных пользователя</p>
        <p className={styles.sub}>
          Откройте мини-приложение из Telegram. В браузере используется мок (
          <code>src/telegram/mock.ts</code>).
        </p>
      </div>
    </div>
  )
}
