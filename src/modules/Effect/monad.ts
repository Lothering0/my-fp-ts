import * as Result from '../Result'
import * as Monad_ from '../../typeclasses/Monad'
import { Functor } from './functor'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'
import { Effect, Hkt, fromReaderResult, run } from './effect'
import { create } from './_internal'

export const Monad = Monad_.create<Hkt>(FromIdentity, Functor, {
  flat: <A, E1, E2, R>(effect: Effect<Effect<A, E1, R>, E2, R>) =>
    create<Effect<A, E1, R>, E2, A, E1 | E2, R>(
      result => r =>
        Result.isSuccess(result) ? run(r)(result.success) : result,
      effect,
    ),
})

export const Do = Monad.Do

export const flat: {
  <A, E1, E2, R>(effect: Effect<Effect<A, E2, R>, E1, R>): Effect<A, E1 | E2, R>
} = Monad.flat

export const flatMap: {
  <A, B, E1, R>(
    amb: (a: A) => Effect<B, E1, R>,
  ): <E2>(effect: Effect<A, E2, R>) => Effect<B, E1 | E2, R>
} = Monad.flatMap

export const andThen: {
  <A, E1, R>(
    effect: Effect<A, E1, R>,
  ): <E2>(selfEffect: Effect<unknown, E2, R>) => Effect<A, E1 | E2, R>
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
  ): <E, R>(effect: Effect<A, E, R>) => Effect<DoObject<N, A, B>, E, R>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E, R>(effect: Effect<A, E, R>) => Effect<DoObject<N, A, B>, E, R>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    effect: Effect<(a: A) => B, E1, R>,
  ): <E2>(selfEffect: Effect<A, E2, R>) => Effect<DoObject<N, A, B>, E1 | E2, R>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    effect: Effect<B, E1, R>,
  ): <E2>(selfEffect: Effect<A, E2, R>) => Effect<DoObject<N, A, B>, E1 | E2, R>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Effect<B, E1, R>,
  ): <E2>(effect: Effect<A, E2, R>) => Effect<DoObject<N, A, B>, E1 | E2, R>
} = Monad.flatMapTo

export const concurrently: {
  <N extends DoObjectKey, A, E1, R>(
    effect: Effect<A, E1, R>,
  ): <A, E2>(
    selfEffect: Effect<A, E2, R>,
  ) => Effect<DoObject<N, A, A>, E1 | E2, R>
} = effect => selfEffect =>
  fromReaderResult(r =>
    Promise.all([
      Promise.resolve(run(r)(effect)),
      Promise.resolve(run(r)(selfEffect)),
    ]).then(([ma, mb]) => pipe(mb, Result.andThen(ma) as any)),
  )

export const concurrentlyTo: {
  <N extends DoObjectKey, A, B, E1, R>(
    name: Exclude<N, keyof A>,
    effect: Effect<B, E1, R>,
  ): <E2>(selfEffect: Effect<A, E1, R>) => Effect<DoObject<N, A, B>, E1 | E2, R>
} = (name, effect) => selfEffect =>
  fromReaderResult(r =>
    Promise.all([
      Promise.resolve(run(r)(selfEffect)),
      Promise.resolve(run(r)(effect)),
    ]).then(([ma, mb]) => Result.bind(name, mb)(ma)),
  )
