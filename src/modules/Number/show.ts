import * as show_ from "../../types/Show"

export const show: {
  <N extends number>(self: N): `${N}`
} = self => `${self}`

export const Show: show_.Show<number> = { show }
