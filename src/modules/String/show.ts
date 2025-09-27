import * as Show_ from '../../typeclasses/Show'

export const show: {
  <S extends string>(self: S): `"${S}"`
} = self => `"${self}"`

export const Show: Show_.Show<string> = { show }
