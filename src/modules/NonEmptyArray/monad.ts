import * as A from "../Array"
import * as M from "../../types/Monad"
import { Sync } from "../Sync"
import { NonEmptyArray, NonEmptyArrayHKT } from "./non-empty-array"
import { DoObject } from "../../types/DoObject"

export const Monad = {
  ...A.Monad,
} as M.Monad<NonEmptyArrayHKT>

export const Do = Monad.Do

export const flat: {
  <A>(self: NonEmptyArray<NonEmptyArray<A>>): NonEmptyArray<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => NonEmptyArray<B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<B>
  <A, B>(
    self: NonEmptyArray<A>,
    amb: (a: A) => NonEmptyArray<B>,
  ): NonEmptyArray<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => NonEmptyArray<C>,
    amb: (a: A) => NonEmptyArray<B>,
  ): (a: A) => NonEmptyArray<C>
  <A, B, C>(
    bmc: (b: B) => NonEmptyArray<C>,
    amb: (a: A) => NonEmptyArray<B>,
    a: A,
  ): NonEmptyArray<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: NonEmptyArray<A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): NonEmptyArray<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: NonEmptyArray<A>,
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): NonEmptyArray<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: NonEmptyArray<(a: A) => B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: NonEmptyArray<A>,
    name: Exclude<N, keyof A>,
    fab: NonEmptyArray<(a: A) => B>,
  ): NonEmptyArray<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: NonEmptyArray<B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: NonEmptyArray<A>,
    name: Exclude<N, keyof A>,
    fb: NonEmptyArray<B>,
  ): NonEmptyArray<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => NonEmptyArray<B>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: NonEmptyArray<A>,
    name: Exclude<N, keyof A>,
    amb: (a: A) => NonEmptyArray<B>,
  ): NonEmptyArray<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(
    am_: (a: A) => NonEmptyArray<_>,
  ): (self: NonEmptyArray<A>) => NonEmptyArray<A>
  <A, _>(
    self: NonEmptyArray<A>,
    am_: (a: A) => NonEmptyArray<_>,
  ): NonEmptyArray<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: NonEmptyArray<A>) => NonEmptyArray<A>
  <A, _>(self: NonEmptyArray<A>, am_: (a: A) => Sync<_>): NonEmptyArray<A>
} = Monad.tapSync
