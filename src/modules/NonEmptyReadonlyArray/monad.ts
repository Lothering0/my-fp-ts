import * as RA from "../ReadonlyArray"
import * as M from "../../types/Monad"
import { Sync } from "../Sync"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHKT,
} from "./non-empty-readonly-array"
import { DoObject } from "../../types/DoObject"

export const Monad = {
  ...RA.Monad,
} as M.Monad<NonEmptyReadonlyArrayHKT>

export const Do = Monad.Do

export const flat: {
  <A>(
    self: NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>,
  ): NonEmptyReadonlyArray<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => NonEmptyReadonlyArray<B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => NonEmptyReadonlyArray<C>,
    amb: (a: A) => NonEmptyReadonlyArray<B>,
  ): (a: A) => NonEmptyReadonlyArray<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: NonEmptyReadonlyArray<(a: A) => B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: NonEmptyReadonlyArray<B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => NonEmptyReadonlyArray<B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(
    am_: (a: A) => NonEmptyReadonlyArray<_>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
} = Monad.tap

export const tapSync: {
  <A, _>(
    am_: (a: A) => Sync<_>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
} = Monad.tapSync
