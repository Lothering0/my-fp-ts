import * as Show_ from '../../typeclasses/Show'

export const show: {
  <S extends string>(string: S): `"${S}"`
} = string => `"${string}"`

export const Show: Show_.Show<string> = { show }
