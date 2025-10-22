import * as Result from '../Result'
import { create } from '../../typeclasses/Monad'
import { Functor } from './functor'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'
import { Effect, EffectHkt, fromOperation } from './effect'

export const Monad = create<EffectHkt>(FromIdentity, Functor, {
  flat: self =>
    fromOperation(() => {
      const mma = self.run()

      if (mma instanceof Promise) {
        return mma.then(
          Result.match({
            onSuccess: ma => ma.run(),
            onFailure: Result.fail,
          }),
        )
      }

      return pipe(
        mma,
        Result.match({
          onSuccess: ma => ma.run(),
          onFailure: Result.fail,
        }),
      )
    }),
})

export const Do = Monad.Do

export const flat: {
  <A, E1, E2>(self: Effect<Effect<A, E2>, E1>): Effect<A, E1 | E2>
} = Monad.flat

export const flatMap: {
  <A, B, E1>(
    amb: (a: A) => Effect<B, E1>,
  ): <E2>(self: Effect<A, E2>) => Effect<B, E1 | E2>
} = Monad.flatMap

export const compose: {
  <E1, E2, A, B, C>(
    bmc: (b: B) => Effect<C, E2>,
    amb: (a: A) => Effect<B, E1>,
  ): (a: A) => Effect<C, E1 | E2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(self: Effect<A, E>) => Effect<DoObject<N, A, B>, E>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(self: Effect<A, E>) => Effect<DoObject<N, A, B>, E>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fab: Effect<(a: A) => B, E1>,
  ): <E2>(self: Effect<A, E2>) => Effect<DoObject<N, A, B>, E1 | E2>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fb: Effect<B, E1>,
  ): <E2>(self: Effect<A, E2>) => Effect<DoObject<N, A, B>, E1 | E2>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Effect<B, E1>,
  ): <E2>(self: Effect<A, E2>) => Effect<DoObject<N, A, B>, E1 | E2>
} = Monad.flatMapTo

export const concurrently: {
  <N extends DoObjectKey, A, E1>(
    fb: Effect<A, E1>,
  ): <A, E2>(self: Effect<A, E2>) => Effect<DoObject<N, A, A>, E1 | E2>
} = fb => self =>
  fromOperation(() =>
    Promise.all([
      Promise.resolve(fb.run()),
      Promise.resolve(self.run()),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]).then(([ma, mb]) => pipe(mb, Result.flatMap(() => ma) as any)),
  )

export const concurrentlyTo: {
  <N extends DoObjectKey, A, B, E1>(
    name: Exclude<N, keyof A>,
    fb: Effect<B, E1>,
  ): <E2>(self: Effect<A, E1>) => Effect<DoObject<N, A, B>, E1 | E2>
} = (name, fb) => self =>
  fromOperation(() =>
    Promise.all([Promise.resolve(self.run()), Promise.resolve(fb.run())]).then(
      ([ma, mb]) => Result.bind(name, mb)(ma),
    ),
  )
