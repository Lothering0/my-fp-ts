import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'
import { State, StateHkt } from './state'

export const Applicative = create<StateHkt>(Monad)

export const apply: {
  <S, A>(
    state: State<S, A>,
  ): <B>(selfState: State<S, (a: A) => B>) => State<S, B>
} = Applicative.apply

export const flipApply: {
  <S, A, B>(
    state: State<S, (a: A) => B>,
  ): (selfState: State<S, A>) => State<S, B>
} = Applicative.flipApply
