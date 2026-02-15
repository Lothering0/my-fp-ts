import * as Show_ from '../../typeclasses/Show'

export const show: {
  <N extends number>(n: N): `${N}`
} = n => `${n}`

export const Show: Show_.Show<number> = { show }
