import { Applicative } from './applicative'
import { fail, Result, ResultHkt } from './result'
import { match } from './matchers'
import { create } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { identity } from '../Identity'

export const Monad = create<ResultHkt>(Applicative, {
  flat: match({
    onFailure: fail,
    onSuccess: identity,
  }),
})

export const Do = Monad.Do

export const flat: {
  <Failure1, Failure2, Out>(
    self: Result<Failure1, Result<Failure2, Out>>,
  ): Result<Failure1 | Failure2, Out>
} = Monad.flat

export const flatMap: {
  <Failure1, In, Out>(
    amb: (a: In) => Result<Failure1, Out>,
  ): <Failure2>(self: Result<Failure2, In>) => Result<Failure1 | Failure2, Out>
} = Monad.flatMap

export const compose: {
  <Failure1, Failure2, In, Out1, Out2>(
    bmc: (b: Out1) => Result<Failure2, Out2>,
    amb: (a: In) => Result<Failure1, Out1>,
  ): (a: In) => Result<Failure1 | Failure2, Out2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    b: Out,
  ): <E>(self: Result<E, In>) => Result<E, DoObject<N, In, Out>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(self: Result<E, A>) => Result<E, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fab: Result<E1, (a: A) => B>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fb: Result<E1, B>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Result<E1, B>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, DoObject<N, A, B>>
} = Monad.flatMapTo
