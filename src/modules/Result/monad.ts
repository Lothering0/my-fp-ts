import { Functor } from './functor'
import { fail, Result, ResultHkt } from './result'
import { match } from './matchers'
import { create } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { identity } from '../Identity'
import { FromIdentity } from './from-identity'

export const Monad = create<ResultHkt>(FromIdentity, Functor, {
  flat: match({
    onFailure: fail,
    onSuccess: identity,
  }),
})

export const Do = Monad.Do

export const flat: {
  <A, E1, E2>(self: Result<Result<A, E2>, E1>): Result<A, E1 | E2>
} = Monad.flat

export const flatMap: {
  <A, B, E1>(
    amb: (a: A) => Result<B, E1>,
  ): <E2>(self: Result<A, E2>) => Result<B, E1 | E2>
} = Monad.flatMap

export const andThen: {
  <A, E1>(
    ma: Result<A, E1>,
  ): <E2>(self: Result<unknown, E2>) => Result<A, E1 | E2>
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
  ): <E>(self: Result<A, E>) => Result<DoObject<N, A, B>, E>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(self: Result<A, E>) => Result<DoObject<N, A, B>, E>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fab: Result<(a: A) => B, E1>,
  ): <E2>(self: Result<A, E2>) => Result<DoObject<N, A, B>, E1 | E2>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fb: Result<B, E1>,
  ): <E2>(self: Result<A, E2>) => Result<DoObject<N, A, B>, E1 | E2>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Result<B, E1>,
  ): <E2>(self: Result<A, E2>) => Result<DoObject<N, A, B>, E1 | E2>
} = Monad.flatMapTo
