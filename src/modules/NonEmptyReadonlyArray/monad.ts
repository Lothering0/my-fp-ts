import * as readonlyArray from "../ReadonlyArray"
import * as monad from "../../typeclasses/Monad"
import * as monadWithIndex from "../../typeclasses/MonadWithIndex"
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from "./non-empty-readonly-array"
import { DoObject, DoObjectKey } from "../../types/DoObject"

export const Monad = {
  ...readonlyArray.Monad,
} as monad.Monad<NonEmptyReadonlyArrayHkt>

export const MonadWithIndex = {
  ...readonlyArray.MonadWithIndex,
} as monadWithIndex.MonadWithIndex<NonEmptyReadonlyArrayHkt, number>

export const Do = Monad.Do

export const flat: {
  <A>(
    self: NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>,
  ): NonEmptyReadonlyArray<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A, i: number) => NonEmptyReadonlyArray<B>,
  ): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B>
} = MonadWithIndex.flatMapWithIndex

export const compose: {
  <A, B, C>(
    bmc: (b: B, i: number) => NonEmptyReadonlyArray<C>,
    amb: (a: A) => NonEmptyReadonlyArray<B>,
  ): (a: A) => NonEmptyReadonlyArray<C>
} = MonadWithIndex.composeWithIndex

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A, i: number) => B,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.mapToWithIndex

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: NonEmptyReadonlyArray<(a: A, i: number) => B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.flapToWithIndex

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: NonEmptyReadonlyArray<B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => NonEmptyReadonlyArray<B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.flatMapToWithIndex
