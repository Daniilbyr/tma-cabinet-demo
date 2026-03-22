import type { AppUser } from '../model/types'

export type TelegramWebAppUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export function mapWebAppUser(u: TelegramWebAppUser | undefined): AppUser | null {
  if (!u) return null
  return {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    username: u.username,
    languageCode: u.language_code,
  }
}
