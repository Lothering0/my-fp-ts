import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'
import { State, StateHkt } from './state'

export const Applicative = create<StateHkt>(Monad)

export const apply: {
  <S, A>(fa: State<S, A>): <B>(self: State<S, (a: A) => B>) => State<S, B>
} = Applicative.apply

export const flipApply: {
  <S, A, B>(fab: State<S, (a: A) => B>): (self: State<S, A>) => State<S, B>
} = Applicative.flipApply
