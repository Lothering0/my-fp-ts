import { flow } from '../../utils/flow'
import { create } from '../../typeclasses/Monad'
import { Functor } from './functor'
import { State, Hkt } from './state'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'

export const Monad = create<Hkt>(FromIdentity, Functor, {
  flat: state => flow(state, ([ma, s1]) => ma(s1)),
})

export const Do = Monad.Do

export const flat: {
  <S, A>(state: State<S, State<S, A>>): State<S, A>
} = Monad.flat

export const flatMap: {
  <S, A, B>(amb: (a: A) => State<S, B>): (state: State<S, A>) => State<S, B>
} = Monad.flatMap

export const andThen: {
  <S, A>(state: State<S, A>): (selfState: State<S, unknown>) => State<S, A>
} = Monad.andThen

export const compose: {
  <S, A, B, C>(
    amb: (a: A) => State<S, B>,
    bmc: (b: B) => State<S, C>,
  ): (a: A) => State<S, C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <S>(state: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <S>(state: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, S, A, B>(
    name: Exclude<N, keyof A>,
    state: State<S, (a: A) => B>,
  ): (selfState: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, S, A, B>(
    name: Exclude<N, keyof A>,
    state: State<S, B>,
  ): (selfState: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, S, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => State<S, B>,
  ): (state: State<S, A>) => State<S, DoObject<N, A, B>>
} = Monad.flatMapTo
