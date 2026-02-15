import { Functor } from './functor'
import { fail, Result, Hkt } from './result'
import { match } from './matchers'
import { create } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { identity } from '../Identity'
import { FromIdentity } from './from-identity'

export const Monad = create<Hkt>(FromIdentity, Functor, {
  flat: match({
    onFailure: fail,
    onSuccess: identity,
  }),
})

export const Do = Monad.Do

export const flat: {
  <A, E1, E2>(result: Result<Result<A, E2>, E1>): Result<A, E1 | E2>
} = Monad.flat

export const flatMap: {
  <A, B, E1>(
    amb: (a: A) => Result<B, E1>,
  ): <E2>(result: Result<A, E2>) => Result<B, E1 | E2>
} = Monad.flatMap

export const andThen: {
  <A, E1>(
    result: Result<A, E1>,
  ): <E2>(selfResult: Result<unknown, E2>) => Result<A, E1 | E2>
} = Monad.andThen

export const compose: {
  <E1, E2, A, B, C>(
    amb: (a: A) => Result<B, E1>,
    bmc: (b: B) => Result<C, E2>,
  ): (a: A) => Result<C, E1 | E2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(result: Result<A, E>) => Result<DoObject<N, A, B>, E>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(result: Result<A, E>) => Result<DoObject<N, A, B>, E>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    result: Result<(a: A) => B, E1>,
  ): <E2>(selfResult: Result<A, E2>) => Result<DoObject<N, A, B>, E1 | E2>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    result: Result<B, E1>,
  ): <E2>(selfResult: Result<A, E2>) => Result<DoObject<N, A, B>, E1 | E2>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Result<B, E1>,
  ): <E2>(selfResult: Result<A, E2>) => Result<DoObject<N, A, B>, E1 | E2>
} = Monad.flatMapTo
