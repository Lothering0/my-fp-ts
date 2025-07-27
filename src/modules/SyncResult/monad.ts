import * as result from "../Result"
import { Sync } from "../Sync"
import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { SyncResultHKT, execute, SyncResult } from "./sync-result"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"

export const Monad = createMonad<SyncResultHKT> ({
  ...Applicative,
  flat: self => () =>
    pipe (self, execute, ma =>
      result.isFailure (ma) ? ma : pipe (ma, result.fromSuccess, execute),
    ),
})

export const Do = Monad.Do

export const flat: {
  <_, A>(self: SyncResult<_, SyncResult<_, A>>): SyncResult<_, A>
} = Monad.flat

export const flatMap: {
  <_, A, B>(
    amb: (a: A) => SyncResult<_, B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, B>
} = Monad.flatMap

export const compose: {
  <_, A, B, C>(
    bmc: (b: B) => SyncResult<_, C>,
    amb: (a: A) => SyncResult<_, B>,
  ): (a: A) => SyncResult<_, C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <_>(self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <_>(self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, _, A, B>(
    name: Exclude<N, keyof A>,
    fab: SyncResult<_, (a: A) => B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, _, A, B>(
    name: Exclude<N, keyof A>,
    fb: SyncResult<_, B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, _, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncResult<_, B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <_, A, _2>(
    am_: (a: A) => SyncResult<_, _2>,
  ): (self: SyncResult<_, A>) => SyncResult<_, A>
} = Monad.tap

export const tapSync: {
  <A, _>(
    am_: (a: A) => Sync<_>,
  ): <_2>(self: SyncResult<_2, A>) => SyncResult<_2, A>
} = Monad.tapSync

export const tapResult: {
  <E, A, _>(
    f: (a: A) => result.Result<E, _>,
  ): (self: SyncResult<E, A>) => SyncResult<E, A>
} = f => self => () => pipe (self, execute, result.tap (f))
