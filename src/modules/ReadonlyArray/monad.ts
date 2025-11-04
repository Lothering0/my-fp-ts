import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import { ReadonlyArrayHkt } from './readonly-array'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Functor, FunctorWithIndex } from './functor'
import { FromIdentity } from './from-identity'
import { getIterableGen } from '../_internal'

export const Monad = Monad_.create<ReadonlyArrayHkt>(FromIdentity, Functor, {
  flat: self => self.flat(),
})

export const MonadWithIndex = MonadWithIndex_.create<ReadonlyArrayHkt, number>(
  FunctorWithIndex,
  Monad,
)

export const Do = Monad.Do

export const flat: {
  <A>(self: ReadonlyArray<ReadonlyArray<A>>): ReadonlyArray<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A, i: number) => ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = MonadWithIndex.flatMapWithIndex

export const andThen: {
  <A>(ma: ReadonlyArray<A>): (self: ReadonlyArray<unknown>) => ReadonlyArray<A>
} = MonadWithIndex.andThen

export const compose: {
  <A, B, C>(
    bmc: (b: B, i: number) => ReadonlyArray<C>,
    amb: (a: A) => ReadonlyArray<B>,
  ): (a: A) => ReadonlyArray<C>
} = MonadWithIndex.composeWithIndex

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A, i: number) => B,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.mapToWithIndex

export const flipApplyToWithIndex: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: ReadonlyArray<(a: A, i: number) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.flipApplyToWithIndex

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.flatMapToWithIndex

export interface GenUtils {
  readonly $: <A>(
    self: ReadonlyArray<A> | (() => ReadonlyArray<A>),
  ) => ReadonlyArrayIterable<A>
  readonly where: (a: boolean) => Generator<unknown, void>
}

export interface ReadonlyArrayGenerator<A> {
  (genUtils: GenUtils): Generator<unknown, A>
}

export interface ReadonlyArrayIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(
  self: ReadonlyArray<A> | (() => ReadonlyArray<A>),
): ReadonlyArrayIterable<A> {
  return (yield self) as A
}

function* where(a: boolean) {
  if (!a) {
    return yield* makeIterable([])
  }
}

export const gen: {
  <A>(generator: ReadonlyArrayGenerator<A>): ReadonlyArray<A>
} = getIterableGen(Monad, {
  $: makeIterable,
  where,
})
