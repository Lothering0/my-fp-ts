import { create } from '../../typeclasses/Applicative'
import { OptionHkt, Option } from './option'
import { Monad } from './monad'

export const Applicative = create<OptionHkt>(Monad)

export const apply: {
  <A>(fa: Option<A>): <B>(self: Option<(a: A) => B>) => Option<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(fab: Option<(a: A) => B>): (self: Option<A>) => Option<B>
} = Applicative.flipApply
