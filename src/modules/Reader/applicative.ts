import * as Applicative_ from '../../typeclasses/Applicative'
import { Monad } from './monad'
import { Reader, Hkt } from './reader'

export const Applicative = Applicative_.create<Hkt>(Monad)

export const apply: {
  <R, A>(
    reader: Reader<R, A>,
  ): <B>(selfReader: Reader<R, (a: A) => B>) => Reader<R, B>
} = Applicative.apply

export const flipApply: {
  <R, A, B>(
    reader: Reader<R, (a: A) => B>,
  ): (selfReader: Reader<R, A>) => Reader<R, B>
} = Applicative.flipApply
