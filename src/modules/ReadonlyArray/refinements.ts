import * as Array from './readonly-array'

export const isEmpty = <A>(self: ReadonlyArray<A>): self is readonly [] =>
  self.length === 0

export const isNonEmpty = <A>(
  self: ReadonlyArray<A>,
): self is Array.NonEmpty<A> => !isEmpty(self)

export const isArray = (x: any): x is any[] => Array.Array.isArray(x)

export const isArrayAndNonEmpty = (x: any): x is Array.NonEmpty<any> =>
  Array.Array.isArray(x) && isNonEmpty(x)
