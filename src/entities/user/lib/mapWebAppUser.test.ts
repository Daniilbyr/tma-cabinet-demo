import { describe, expect, it } from 'vitest'
import { mapWebAppUser } from './mapWebAppUser'

describe('mapWebAppUser', () => {
  it('maps telegram user shape', () => {
    expect(
      mapWebAppUser({
        id: 1,
        first_name: 'Test',
        username: 't',
      }),
    ).toEqual({
      id: 1,
      firstName: 'Test',
      username: 't',
    })
  })

  it('returns null when user missing', () => {
    expect(mapWebAppUser(undefined)).toBeNull()
  })
})
