import * as Applicative_ from '../../typeclasses/Applicative'
import { Monad } from './monad'
import { Reader, ReaderHkt } from './reader'

export const Applicative = Applicative_.create<ReaderHkt>(Monad)

export const apply: {
  <R, A>(fa: Reader<R, A>): <B>(self: Reader<R, (a: A) => B>) => Reader<R, B>
} = Applicative.apply

export const flipApply: {
  <R, A, B>(fab: Reader<R, (a: A) => B>): (self: Reader<R, A>) => Reader<R, B>
} = Applicative.flipApply
