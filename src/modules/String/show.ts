import * as show_ from '../../typeclasses/Show'

export const show: {
  <S extends string>(self: S): `"${S}"`
} = self => `"${self}"`

export const Show: show_.Show<string> = { show }
