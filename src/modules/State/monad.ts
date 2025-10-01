import { flow } from '../../utils/flow'
import { create } from '../../typeclasses/Monad'
import { Functor } from './functor'
import { State, StateHkt } from './state'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'

export const Monad = create<StateHkt>(FromIdentity, Functor, {
  flat: self => flow(self, ([ma, s1]) => ma(s1)),
})

export const Do = Monad.Do

export const flat: {
  <S, A>(self: State<S, State<S, A>>): State<S, A>
} = Monad.flat

export const flatMap: {
  <S, A, B>(amb: (a: A) => State<S, B>): (self: State<S, A>) => State<S, B>
} = Monad.flatMap

export const compose: {
  <S, A, B, C>(
    bmc: (b: B) => State<S, C>,
    amb: (a: A) => State<S, B>,
  ): (a: A) => State<S, C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <S>(self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <S>(self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, S, A, B>(
    name: Exclude<N, keyof A>,
    fab: State<S, (a: A) => B>,
  ): (self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.flipApplyTo

export const apS: {
  <N extends DoObjectKey, S, A, B>(
    name: Exclude<N, keyof A>,
    fb: State<S, B>,
  ): (self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, S, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => State<S, B>,
  ): (self: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.flatMapTo
