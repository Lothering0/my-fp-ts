import * as Show_ from '../../typeclasses/Show'

export const show: {
  <B extends boolean>(self: B): `${B}`
} = self => `${self}`

export const Show: Show_.Show<boolean> = { show }
