import * as SR from "../SyncResult"
import * as O from "../Option"
import { Sync } from "../Sync"
import { Result } from "../Result"
import { createMonad } from "../../types/Monad"
import { DoObject } from "../../types/DoObject"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { SyncOptionHKT, execute, SyncOption } from "./sync-option"
import { overload } from "../../utils/overloads"

export const Monad = createMonad<SyncOptionHKT> ({
  ...Applicative,
  flat: self => () =>
    pipe (self, execute, ma =>
      O.isNone (ma) ? ma : pipe (ma, O.fromSome, execute),
    ),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: SyncOption<SyncOption<A>>): SyncOption<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => SyncOption<B>): (self: SyncOption<A>) => SyncOption<B>
  <A, B>(self: SyncOption<A>, amb: (a: A) => SyncOption<B>): SyncOption<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => SyncOption<C>,
    amb: (a: A) => SyncOption<B>,
  ): (a: A) => SyncOption<C>
  <A, B, C>(
    bmc: (b: B) => SyncOption<C>,
    amb: (a: A) => SyncOption<B>,
    a: A,
  ): SyncOption<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: SyncOption<A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): SyncOption<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: SyncOption<A>,
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): SyncOption<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: SyncOption<(a: A) => B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: SyncOption<A>,
    name: Exclude<N, keyof A>,
    fab: SyncOption<(a: A) => B>,
  ): SyncOption<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: SyncOption<B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: SyncOption<A>,
    name: Exclude<N, keyof A>,
    fb: SyncOption<B>,
  ): SyncOption<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncOption<B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: SyncOption<A>,
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncOption<B>,
  ): SyncOption<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(am_: (a: A) => SyncOption<_>): (self: SyncOption<A>) => SyncOption<A>
  <A, _>(self: SyncOption<A>, am_: (a: A) => SyncOption<_>): SyncOption<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: SyncOption<A>) => SyncOption<A>
  <A, _>(self: SyncOption<A>, am_: (a: A) => Sync<_>): SyncOption<A>
} = Monad.tapSync

export const tapOption: {
  <A, _>(f: (a: A) => O.Option<_>): (self: SyncOption<A>) => SyncOption<A>
  <A, _>(self: SyncOption<A>, f: (a: A) => O.Option<_>): SyncOption<A>
} = overload (1, (self, f) => () => pipe (self, execute, O.tap (f)))

export const tapResult: {
  <E, A, _>(f: (a: A) => Result<E, _>): (self: SyncOption<A>) => SyncOption<A>
  <E, A, _>(self: SyncOption<A>, f: (a: A) => Result<E, _>): SyncOption<A>
} = overload (1, (self, f) => () => pipe (self, execute, O.tapResult (f)))

export const tapSyncResult: {
  <E, A, _>(
    f: (a: A) => SR.SyncResult<E, _>,
  ): (self: SyncOption<A>) => SyncOption<A>
  <E, A, _>(
    self: SyncOption<A>,
    f: (a: A) => SR.SyncResult<E, _>,
  ): SyncOption<A>
} = overload (
  1,
  (self, f) => () =>
    pipe (
      self,
      execute,
      O.tap (a => pipe (a, f, SR.execute, O.fromResult)),
    ),
)
