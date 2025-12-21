import { LazyArg } from '../../types/utils'
import { List } from './list'
import { isNil } from './refinements'

export interface Matchers<A, B, C = B> {
  readonly onNil: LazyArg<B>
  readonly onCons: (a: A) => C
}

export const match: {
  <A, B, C = B>(matchers: Matchers<A, B, C>): (self: List<A>) => B | C
} = matchers => self =>
  isNil(self) ? matchers.onNil() : matchers.onCons(self.head)
