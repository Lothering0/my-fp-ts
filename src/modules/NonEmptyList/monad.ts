import * as List from '../List'
import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import { NonEmptyList, NonEmptyListHkt } from './non-empty-list'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { getIterableGen } from '../_internal'

export const Monad = {
  ...List.Monad,
} as Monad_.Monad<NonEmptyListHkt>

export const MonadWithIndex = {
  ...List.MonadWithIndex,
} as MonadWithIndex_.MonadWithIndex<NonEmptyListHkt, number>

export const Do = Monad.Do

export const flat: {
  <A>(list: NonEmptyList<NonEmptyList<A>>): NonEmptyList<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A, i: number) => NonEmptyList<B>,
  ): (list: NonEmptyList<A>) => NonEmptyList<B>
} = MonadWithIndex.flatMapWithIndex

export const andThen: {
  <A>(ma: NonEmptyList<A>): (list: NonEmptyList<unknown>) => NonEmptyList<A>
} = MonadWithIndex.andThen

export const compose: {
  <A, B, C>(
    bmc: (b: B, i: number) => NonEmptyList<C>,
    amb: (a: A) => NonEmptyList<B>,
  ): (a: A) => NonEmptyList<C>
} = MonadWithIndex.composeWithIndex

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (list: NonEmptyList<A>) => NonEmptyList<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A, i: number) => B,
  ): (list: NonEmptyList<A>) => NonEmptyList<DoObject<N, A, B>>
} = MonadWithIndex.mapToWithIndex

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: NonEmptyList<(a: A, i: number) => B>,
  ): (list: NonEmptyList<A>) => NonEmptyList<DoObject<N, A, B>>
} = MonadWithIndex.flipApplyToWithIndex

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: NonEmptyList<B>,
  ): (list: NonEmptyList<A>) => NonEmptyList<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => NonEmptyList<B>,
  ): (list: NonEmptyList<A>) => NonEmptyList<DoObject<N, A, B>>
} = MonadWithIndex.flatMapToWithIndex

export interface NonEmptyListGenerator<A> {
  (
    makeIterable: <A>(
      list: NonEmptyList<A> | (() => NonEmptyList<A>),
    ) => NonEmptyListIterable<A>,
  ): Generator<unknown, A>
}

export interface NonEmptyListIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(
  list: NonEmptyList<A> | (() => NonEmptyList<A>),
): NonEmptyListIterable<A> {
  return (yield list) as A
}

export const gen: {
  <A>(generator: NonEmptyListGenerator<A>): NonEmptyList<A>
} = getIterableGen(Monad, makeIterable)
