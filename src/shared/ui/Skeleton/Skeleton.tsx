import clsx from 'clsx'
import type { CSSProperties } from 'react'
import styles from './Skeleton.module.scss'

type Props = {
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export function Skeleton({ className, style, ...rest }: Props) {
  return (
    <div
      className={clsx(styles.block, className)}
      style={style}
      role="status"
      {...rest}
    />
  )
}
