import { Sync } from "../Sync"
import { ReadonlyArrayHKT } from "./readonly-array"
import { createMonad } from "../../types/Monad"
import { DoObject } from "../../types/DoObject"
import { Applicative } from "./applicative"

export const Monad = createMonad<ReadonlyArrayHKT> ({
  ...Applicative,
  flat: self => self.flat (),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: ReadonlyArray<ReadonlyArray<A>>): ReadonlyArray<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
  <A, B>(
    self: ReadonlyArray<A>,
    amb: (a: A) => ReadonlyArray<B>,
  ): ReadonlyArray<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => ReadonlyArray<C>,
    amb: (a: A) => ReadonlyArray<B>,
  ): (a: A) => ReadonlyArray<C>
  <A, B, C>(
    bmc: (b: B) => ReadonlyArray<C>,
    amb: (a: A) => ReadonlyArray<B>,
    a: A,
  ): ReadonlyArray<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: ReadonlyArray<A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): ReadonlyArray<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: ReadonlyArray<A>,
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): ReadonlyArray<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: ReadonlyArray<(a: A) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: ReadonlyArray<A>,
    name: Exclude<N, keyof A>,
    fab: ReadonlyArray<(a: A) => B>,
  ): ReadonlyArray<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: ReadonlyArray<A>,
    name: Exclude<N, keyof A>,
    fb: ReadonlyArray<B>,
  ): ReadonlyArray<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: ReadonlyArray<A>,
    name: Exclude<N, keyof A>,
    amb: (a: A) => ReadonlyArray<B>,
  ): ReadonlyArray<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(
    am_: (a: A) => ReadonlyArray<_>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<A>
  <A, _>(
    self: ReadonlyArray<A>,
    am_: (a: A) => ReadonlyArray<_>,
  ): ReadonlyArray<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: ReadonlyArray<A>) => ReadonlyArray<A>
  <A, _>(self: ReadonlyArray<A>, am_: (a: A) => Sync<_>): ReadonlyArray<A>
} = Monad.tapSync
