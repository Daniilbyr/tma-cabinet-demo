import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import styles from './BottomTabBar.module.scss'

const tabs = [
  { to: '/', label: 'Кабинет', end: true },
  { to: '/settings', label: 'Настройки', end: false },
] as const

export function BottomTabBar() {
  return (
    <nav className={styles.bar} aria-label="Основные разделы">
      {tabs.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
