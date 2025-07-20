import { createMonad } from "../../types/Monad"
import { DoObject } from "../../types/DoObject"
import { Applicative } from "./applicative"
import { SyncHKT, Sync, execute } from "./sync"

export const Monad = createMonad<SyncHKT> ({
  ...Applicative,
  flat: execute,
})

export const Do = Monad.Do

export const flat: {
  <A>(self: Sync<Sync<A>>): Sync<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => Sync<B>): (self: Sync<A>) => Sync<B>
  <A, B>(self: Sync<A>, amb: (a: A) => Sync<B>): Sync<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(bmc: (b: B) => Sync<C>, amb: (a: A) => Sync<B>): (a: A) => Sync<C>
  <A, B, C>(bmc: (b: B) => Sync<C>, amb: (a: A) => Sync<B>, a: A): Sync<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Sync<A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): Sync<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Sync<A>,
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): Sync<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: Sync<(a: A) => B>,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Sync<A>,
    name: Exclude<N, keyof A>,
    fab: Sync<(a: A) => B>,
  ): Sync<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: Sync<B>,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Sync<A>,
    name: Exclude<N, keyof A>,
    fb: Sync<B>,
  ): Sync<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Sync<B>,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Sync<A>,
    name: Exclude<N, keyof A>,
    amb: (a: A) => Sync<B>,
  ): Sync<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(am_: (a: A) => Sync<_>): (self: Sync<A>) => Sync<A>
  <A, _>(self: Sync<A>, am_: (a: A) => Sync<_>): Sync<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: Sync<A>) => Sync<A>
  <A, _>(self: Sync<A>, am_: (a: A) => Sync<_>): Sync<A>
} = Monad.tapSync
