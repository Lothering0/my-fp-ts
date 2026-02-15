import { isEmpty } from './refinements'

export interface Matchers<A, B = A> {
  readonly onEmpty: (e: '') => A
  readonly onNonEmpty: (a: string) => B
}

export const match: {
  <A, B = A>(matchers: Matchers<A, B>): (string: string) => A | B
} = matchers => string =>
  isEmpty(string) ? matchers.onEmpty('') : matchers.onNonEmpty(string)
