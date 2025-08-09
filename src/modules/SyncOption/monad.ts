import * as syncResult from "../SyncResult"
import * as option from "../Option"
import { Sync } from "../Sync"
import { Result } from "../Result"
import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { SyncOptionHkt, execute, SyncOption } from "./sync-option"

export const Monad = createMonad<SyncOptionHkt> ({
  ...Applicative,
  flat: self => () =>
    pipe (self, execute, ma =>
      option.isNone (ma) ? ma : pipe (ma, option.value, execute),
    ),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: SyncOption<SyncOption<A>>): SyncOption<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => SyncOption<B>): (self: SyncOption<A>) => SyncOption<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => SyncOption<C>,
    amb: (a: A) => SyncOption<B>,
  ): (a: A) => SyncOption<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: SyncOption<(a: A) => B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: SyncOption<B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => SyncOption<B>,
  ): (self: SyncOption<A>) => SyncOption<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A>(f: (a: A) => SyncOption<unknown>): (self: SyncOption<A>) => SyncOption<A>
} = Monad.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: SyncOption<A>) => SyncOption<A>
} = Monad.tapSync

export const tapOption: {
  <A>(
    f: (a: A) => option.Option<unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () => pipe (self, execute, option.tap (f))

export const tapResult: {
  <E, A>(
    f: (a: A) => Result<E, unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () => pipe (self, execute, option.tapResult (f))

export const tapSyncResult: {
  <E, A>(
    f: (a: A) => syncResult.SyncResult<E, unknown>,
  ): (self: SyncOption<A>) => SyncOption<A>
} = f => self => () =>
  pipe (
    self,
    execute,
    option.tap (a => pipe (a, f, syncResult.execute, option.fromResult)),
  )
