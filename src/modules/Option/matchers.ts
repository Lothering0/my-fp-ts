import { LazyArg } from '../../types/utils'
import { pipe } from '../../utils/flow'
import { Option } from './option'
import { isNone } from './refinements'

export interface Matchers<A, B, C = B> {
  readonly onNone: LazyArg<B>
  readonly onSome: (a: A) => C
}

export const match: {
  <A, B, C = B>(matchers: Matchers<A, B, C>): (option: Option<A>) => B | C
} = matchers => option =>
  isNone(option) ? matchers.onNone() : pipe(option.value, matchers.onSome)
