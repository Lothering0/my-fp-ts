import * as Show_ from '../../typeclasses/Show'

export const show: {
  <N extends number>(self: N): `${N}`
} = self => `${self}`

export const Show: Show_.Show<number> = { show }
