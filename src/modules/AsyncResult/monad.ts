/* eslint-disable @typescript-eslint/no-explicit-any */
import * as result from '../Result'
import * as async from '../Async'
import { identity } from '../Identity'
import { create } from '../../typeclasses/Monad'
import { Applicative } from './applicative'
import { AsyncResultHkt, AsyncResult, toPromise, fail } from './async-result'
import { pipe } from '../../utils/flow'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { match } from './matchers'

export const Monad = create<AsyncResultHkt>(Applicative, {
  flat: self => () =>
    pipe(
      self,
      match({ onFailure: fail, onSuccess: identity }),
      async.toPromise,
      promise => promise.then(toPromise),
    ),
})

export const Do = Monad.Do

export const flat: {
  <Failure1, Failure2, Out>(
    self: AsyncResult<Failure1, AsyncResult<Failure2, Out>>,
  ): AsyncResult<Failure1 | Failure2, Out>
} = Monad.flat

export const flatMap: {
  <Failure1, In, Out>(
    amb: (a: In) => AsyncResult<Failure1, Out>,
  ): <E2>(self: AsyncResult<E2, In>) => AsyncResult<Failure1 | E2, Out>
} = Monad.flatMap

export const compose: {
  <Failure1, Failure2, In, Out1, Out2>(
    bmc: (b: Out1) => AsyncResult<Failure2, Out2>,
    amb: (a: In) => AsyncResult<Failure1, Out1>,
  ): (a: In) => AsyncResult<Failure1 | Failure2, Out2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    b: Out,
  ): <E>(self: AsyncResult<E, In>) => AsyncResult<E, DoObject<N, In, Out>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    ab: (a: In) => Out,
  ): <Failure>(
    self: AsyncResult<Failure, In>,
  ) => AsyncResult<Failure, DoObject<N, In, Out>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, Failure1, In, Out>(
    name: Exclude<N, keyof In>,
    fab: AsyncResult<Failure1, (a: In) => Out>,
  ): <Failure2>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, DoObject<N, In, Out>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, Failure1, In, Out>(
    name: Exclude<N, keyof In>,
    fb: AsyncResult<Failure1, Out>,
  ): <E2>(
    self: AsyncResult<E2, In>,
  ) => AsyncResult<Failure1 | E2, DoObject<N, In, Out>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, Failure1, In, Out>(
    name: Exclude<N, keyof In>,
    amb: (a: In) => AsyncResult<Failure1, Out>,
  ): <Failure2>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, DoObject<N, In, Out>>
} = Monad.flatMapTo

export const parallel: {
  <N extends DoObjectKey, Failure1, Out>(
    fb: AsyncResult<Failure1, Out>,
  ): <Failure2, In>(
    self: AsyncResult<Failure2, In>,
  ) => AsyncResult<Failure1 | Failure2, DoObject<N, In, Out>>
} = fb => self => () =>
  Promise.all([toPromise(self), toPromise(fb)]).then(([ma, mb]) =>
    pipe(mb, result.flatMap(() => ma) as any),
  )

export const parallelTo: {
  <N extends DoObjectKey, Failure1, In, Out>(
    name: Exclude<N, keyof In>,
    fb: AsyncResult<Failure1, Out>,
  ): <Failure2>(
    self: AsyncResult<Failure1, In>,
  ) => AsyncResult<Failure1 | Failure2, DoObject<N, In, Out>>
} = (name, fb) => self => () =>
  Promise.all([toPromise(self), toPromise(fb)]).then(([ma, mb]) =>
    result.apS(name, mb)(ma),
  )
