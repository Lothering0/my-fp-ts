import { Sync } from "../Sync"
import { ArrayHKT } from "./array"
import { createMonad } from "../../types/Monad"
import { DoObject } from "../../types/DoObject"
import { Applicative } from "./applicative"

export const Monad = createMonad<ArrayHKT> ({
  ...Applicative,
  flat: self => self.flat (),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: A[][]): A[]
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => B[]): (self: A[]) => B[]
  <A, B>(self: A[], amb: (a: A) => B[]): B[]
} = Monad.flatMap

export const compose: {
  <A, B, C>(bmc: (b: B) => C[], amb: (a: A) => B[]): (a: A) => C[]
  <A, B, C>(bmc: (b: B) => C[], amb: (a: A) => B[], a: A): C[]
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: A[]) => DoObject<N, A, B>[]
  <N extends string | number | symbol, A, B>(
    self: A[],
    name: Exclude<N, keyof A>,
    b: B,
  ): DoObject<N, A, B>[]
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: A[]) => DoObject<N, A, B>[]
  <N extends string | number | symbol, A, B>(
    self: A[],
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): DoObject<N, A, B>[]
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: ((a: A) => B)[],
  ): (self: A[]) => DoObject<N, A, B>[]
  <N extends string | number | symbol, A, B>(
    self: A[],
    name: Exclude<N, keyof A>,
    fab: ((a: A) => B)[],
  ): DoObject<N, A, B>[]
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: B[],
  ): (self: A[]) => DoObject<N, A, B>[]
  <N extends string | number | symbol, A, B>(
    self: A[],
    name: Exclude<N, keyof A>,
    fb: B[],
  ): DoObject<N, A, B>[]
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => B[],
  ): (self: A[]) => DoObject<N, A, B>[]
  <N extends string | number | symbol, A, B>(
    self: A[],
    name: Exclude<N, keyof A>,
    amb: (a: A) => B[],
  ): DoObject<N, A, B>[]
} = Monad.flatMapTo

export const tap: {
  <A, _>(am_: (a: A) => _[]): (self: A[]) => A[]
  <A, _>(self: A[], am_: (a: A) => _[]): A[]
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: A[]) => A[]
  <A, _>(self: A[], am_: (a: A) => Sync<_>): A[]
} = Monad.tapSync
