import { isEmpty } from './refinements'

export interface Matchers<A, B = A> {
  readonly onEmpty: (e: '') => A
  readonly onNonEmpty: (a: string) => B
}

export const match: {
  <A, B = A>(matchers: Matchers<A, B>): (self: string) => A | B
} = matchers => self =>
  isEmpty(self) ? matchers.onEmpty('') : matchers.onNonEmpty(self)
