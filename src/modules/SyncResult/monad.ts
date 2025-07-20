import * as R from "../Result"
import { Sync } from "../Sync"
import { createMonad } from "../../types/Monad"
import { DoObject } from "../../types/DoObject"
import { SyncResultHKT, execute, SyncResult } from "./sync-result"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Monad = createMonad<SyncResultHKT> ({
  ...Applicative,
  flat: self => () =>
    pipe (self, execute, ma =>
      R.isFailure (ma) ? ma : pipe (ma, R.fromSuccess, execute),
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
  <_, A, B>(
    self: SyncResult<_, A>,
    amb: (a: A) => SyncResult<_, B>,
  ): SyncResult<_, B>
} = Monad.flatMap

export const compose: {
  <_, A, B, C>(
    bmc: (b: B) => SyncResult<_, C>,
    amb: (a: A) => SyncResult<_, B>,
  ): (a: A) => SyncResult<_, C>
  <_, A, B, C>(
    bmc: (b: B) => SyncResult<_, C>,
    amb: (a: A) => SyncResult<_, B>,
    a: A,
  ): SyncResult<_, C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: SyncResult<_, A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): SyncResult<_, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: SyncResult<_, A>,
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): SyncResult<_, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fab: SyncResult<_, (a: A) => B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: SyncResult<_, A>,
    name: Exclude<N, keyof A>,
    fab: SyncResult<_, (a: A) => B>,
  ): SyncResult<_, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    fb: SyncResult<_, B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: SyncResult<_, A>,
    name: Exclude<N, keyof A>,
    fb: SyncResult<_, B>,
  ): SyncResult<_, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncResult<_, B>,
  ): (self: SyncResult<_, A>) => SyncResult<_, DoObject<N, A, B>>
  <N extends string | number | symbol, _, A, B>(
    self: SyncResult<_, A>,
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncResult<_, B>,
  ): SyncResult<_, DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <_, A, _2>(
    am_: (a: A) => SyncResult<_, _2>,
  ): (self: SyncResult<_, A>) => SyncResult<_, A>
  <_, A, _2>(
    self: SyncResult<_, A>,
    am_: (a: A) => SyncResult<_, _2>,
  ): SyncResult<_, A>
} = Monad.tap

export const tapSync: {
  <_, A, _2>(
    am_: (a: A) => Sync<_2>,
  ): (self: SyncResult<_, A>) => SyncResult<_, A>
  <_, A, _2>(self: SyncResult<_, A>, am_: (a: A) => Sync<_2>): SyncResult<_, A>
} = Monad.tapSync

export const tapResult: {
  <E, A, _>(
    f: (a: A) => R.Result<E, _>,
  ): (self: SyncResult<E, A>) => SyncResult<E, A>
  <E, A, _>(
    self: SyncResult<E, A>,
    f: (a: A) => R.Result<E, _>,
  ): SyncResult<E, A>
} = overload (1, (self, f) => () => pipe (self, execute, R.tap (f)))
