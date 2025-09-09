import * as show_ from "../../typeclasses/Show"

export const show: {
  <B extends boolean>(self: B): `${B}`
} = self => `${self}`

export const Show: show_.Show<boolean> = { show }
