/* eslint-disable @typescript-eslint/no-explicit-any */
import * as result from "../Result"
import * as async from "../Async"
import { identity } from "../Identity"
import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"
import { AsyncResultHkt, AsyncResult, toPromise, fail } from "./async-result"
import { pipe } from "../../utils/flow"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { match } from "./utils"

export const Monad = createMonad<AsyncResultHkt> ({
  ...Applicative,
  flat: self => () =>
    pipe (self, match (fail, identity), async.toPromise, promise =>
      promise.then (toPromise),
    ),
})

export const Do = Monad.Do

export const flat: {
  <E1, E2, A>(
    self: AsyncResult<E1, AsyncResult<E2, A>>,
  ): AsyncResult<E1 | E2, A>
} = Monad.flat

export const flatMap: {
  <E1, A, B>(
    amb: (a: A) => AsyncResult<E1, B>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, B>
} = Monad.flatMap

export const compose: {
  <E1, E2, A, B, C>(
    bmc: (b: B) => AsyncResult<E2, C>,
    amb: (a: A) => AsyncResult<E1, B>,
  ): (a: A) => AsyncResult<E1 | E2, C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(self: AsyncResult<E, A>) => AsyncResult<E, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(self: AsyncResult<E, A>) => AsyncResult<E, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fab: AsyncResult<E1, (a: A) => B>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncResult<E1, B>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => AsyncResult<E1, B>,
  ): <E2>(self: AsyncResult<E2, A>) => AsyncResult<E1 | E2, DoObject<N, A, B>>
} = Monad.flatMapTo

export const parallel: {
  <N extends DoObjectKey, E1, B>(
    fb: AsyncResult<E1, B>,
  ): <E2, A>(
    self: AsyncResult<E2, A>,
  ) => AsyncResult<E1 | E2, DoObject<N, A, B>>
} = fb => self => () =>
  Promise.all ([toPromise (self), toPromise (fb)]).then (([ma, mb]) =>
    pipe (mb, result.flatMap (() => ma) as any),
  )

export const parallelTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fb: AsyncResult<E1, B>,
  ): <E2>(self: AsyncResult<E1, A>) => AsyncResult<E1 | E2, DoObject<N, A, B>>
} = (name, fb) => self => () =>
  Promise.all ([toPromise (self), toPromise (fb)]).then (([ma, mb]) =>
    result.apS (name, mb) (ma),
  )
