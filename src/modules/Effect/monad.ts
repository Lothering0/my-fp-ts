import * as Result from '../Result'
import * as Monad_ from '../../typeclasses/Monad'
import { Functor } from './functor'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'
import { Effect, EffectHkt, fromReaderResult, run } from './effect'
import { create } from './_internal'

export const Monad = Monad_.create<EffectHkt>(FromIdentity, Functor, {
  flat: <A, E1, E2, R>(self: Effect<Effect<A, E1, R>, E2, R>) =>
    create<Effect<A, E1, R>, E2, A, E1 | E2, R>(
      ma => r => (Result.isSuccess(ma) ? run(r)(ma.success) : ma),
      self,
    ),
})

export const Do = Monad.Do

export const flat: {
  <A, E1, E2, R>(self: Effect<Effect<A, E2, R>, E1, R>): Effect<A, E1 | E2, R>
} = Monad.flat

export const flatMap: {
  <A, B, E1, R>(
    amb: (a: A) => Effect<B, E1, R>,
  ): <E2>(self: Effect<A, E2, R>) => Effect<B, E1 | E2, R>
} = Monad.flatMap

export const andThen: {
  <A, E1, R>(
    ma: Effect<A, E1, R>,
  ): <E2>(self: Effect<unknown, E2, R>) => Effect<A, E1 | E2, R>
} = Monad.andThen

export const compose: {
  <E1, E2, A, B, C, R>(
    amb: (a: A) => Effect<B, E1, R>,
    bmc: (b: B) => Effect<C, E2, R>,
  ): (a: A) => Effect<C, E1 | E2, R>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E, R>(self: Effect<A, E, R>) => Effect<DoObject<N, A, B>, E, R>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E, R>(self: Effect<A, E, R>) => Effect<DoObject<N, A, B>, E, R>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    fab: Effect<(a: A) => B, E1, R>,
  ): <E2>(self: Effect<A, E2, R>) => Effect<DoObject<N, A, B>, E1 | E2, R>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    fb: Effect<B, E1, R>,
  ): <E2>(self: Effect<A, E2, R>) => Effect<DoObject<N, A, B>, E1 | E2, R>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Effect<B, E1, R>,
  ): <E2>(self: Effect<A, E2, R>) => Effect<DoObject<N, A, B>, E1 | E2, R>
} = Monad.flatMapTo

export const concurrently: {
  <N extends DoObjectKey, A, E1, R>(
    fb: Effect<A, E1, R>,
  ): <A, E2>(self: Effect<A, E2, R>) => Effect<DoObject<N, A, A>, E1 | E2, R>
} = fb => self =>
  fromReaderResult(r =>
    Promise.all([
      Promise.resolve(run(r)(fb)),
      Promise.resolve(run(r)(self)),
    ]).then(([ma, mb]) => pipe(mb, Result.andThen(ma) as any)),
  )

export const concurrentlyTo: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    fb: Effect<B, E1, R>,
  ): <E2>(self: Effect<A, E1, R>) => Effect<DoObject<N, A, B>, E1 | E2, R>
} = (name, fb) => self =>
  fromReaderResult(r =>
    Promise.all([
      Promise.resolve(run(r)(self)),
      Promise.resolve(run(r)(fb)),
    ]).then(([ma, mb]) => Result.bind(name, mb)(ma)),
  )
