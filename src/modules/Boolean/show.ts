import * as Show_ from '../../typeclasses/Show'

export const show: {
  <B extends boolean>(boolean: B): `${B}`
} = boolean => `${boolean}`

export const Show: Show_.Show<boolean> = { show }
