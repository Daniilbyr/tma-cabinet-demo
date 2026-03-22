export function getUserInitials(firstName: string, lastName?: string): string {
  const a = firstName.trim().charAt(0).toUpperCase()
  const b = lastName?.trim().charAt(0).toUpperCase() ?? ''
  return (a + b).slice(0, 2)
}
