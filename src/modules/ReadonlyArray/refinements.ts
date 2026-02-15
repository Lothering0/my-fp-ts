import * as Array from './readonly-array'

export const isEmpty = <A>(array: ReadonlyArray<A>): array is readonly [] =>
  array.length === 0

export const isNonEmpty = <A>(
  array: ReadonlyArray<A>,
): array is Array.NonEmpty<A> => !isEmpty(array)

export const isArray = (x: any): x is any[] => Array.Array.isArray(x)

export const isArrayAndNonEmpty = (x: any): x is Array.NonEmpty<any> =>
  Array.Array.isArray(x) && isNonEmpty(x)
