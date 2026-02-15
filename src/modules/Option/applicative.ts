import { create } from '../../typeclasses/Applicative'
import { Hkt, Option } from './option'
import { Monad } from './monad'

export const Applicative = create<Hkt>(Monad)

export const apply: {
  <A>(option: Option<A>): <B>(selfOption: Option<(a: A) => B>) => Option<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(option: Option<(a: A) => B>): (selfOption: Option<A>) => Option<B>
} = Applicative.flipApply
