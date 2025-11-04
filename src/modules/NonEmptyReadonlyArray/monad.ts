import * as Array from '../ReadonlyArray'
import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { getIterableGen } from '../_internal'

export const Monad = {
  ...Array.Monad,
} as Monad_.Monad<NonEmptyReadonlyArrayHkt>

export const MonadWithIndex = {
  ...Array.MonadWithIndex,
} as MonadWithIndex_.MonadWithIndex<NonEmptyReadonlyArrayHkt, number>

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

export const andThen: {
  <A>(
    ma: NonEmptyReadonlyArray<A>,
  ): (self: NonEmptyReadonlyArray<unknown>) => NonEmptyReadonlyArray<A>
} = MonadWithIndex.andThen

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

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: NonEmptyReadonlyArray<(a: A, i: number) => B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.flipApplyToWithIndex

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: NonEmptyReadonlyArray<B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => NonEmptyReadonlyArray<B>,
  ): (
    self: NonEmptyReadonlyArray<A>,
  ) => NonEmptyReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.flatMapToWithIndex

export interface NonEmptyReadonlyArrayGenerator<A> {
  (
    makeIterable: <A>(
      self: NonEmptyReadonlyArray<A> | (() => NonEmptyReadonlyArray<A>),
    ) => NonEmptyReadonlyArrayIterable<A>,
  ): Generator<unknown, A>
}

export interface NonEmptyReadonlyArrayIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(
  self: NonEmptyReadonlyArray<A> | (() => NonEmptyReadonlyArray<A>),
): NonEmptyReadonlyArrayIterable<A> {
  return (yield self) as A
}

export const gen: {
  <A>(generator: NonEmptyReadonlyArrayGenerator<A>): NonEmptyReadonlyArray<A>
} = getIterableGen(Monad, makeIterable)
