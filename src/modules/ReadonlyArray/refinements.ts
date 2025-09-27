import * as NonEmptyArray from '../NonEmptyReadonlyArray'
import { length } from './utils'

export const isEmpty = <A>(self: ReadonlyArray<A>): self is readonly [] =>
  length(self) === 0

export const isNonEmpty = <A>(
  self: ReadonlyArray<A>,
): self is NonEmptyArray.NonEmptyReadonlyArray<A> => !isEmpty(self)
