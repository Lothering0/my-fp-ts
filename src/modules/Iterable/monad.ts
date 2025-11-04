import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Functor, FunctorWithIndex } from './functor'
import { FromIdentity } from './from-identity'
import { IterableHkt } from './iterable'
import { getIterableGen } from '../_internal'

export const Monad = Monad_.create<IterableHkt>(FromIdentity, Functor, {
  flat: self => ({
    *[Symbol.iterator]() {
      for (const iterable of self) {
        yield* iterable
      }
    },
  }),
})

export const MonadWithIndex = MonadWithIndex_.create<IterableHkt, number>(
  FunctorWithIndex,
  Monad,
)

export const Do = Monad.Do

export const flat: {
  <A>(self: Iterable<Iterable<A>>): Iterable<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A, i: number) => Iterable<B>,
  ): (self: Iterable<A>) => Iterable<B>
} = MonadWithIndex.flatMapWithIndex

export const andThen: {
  <A>(ma: Iterable<A>): (self: Iterable<unknown>) => Iterable<A>
} = MonadWithIndex.andThen

export const compose: {
  <A, B, C>(
    bmc: (b: B, i: number) => Iterable<C>,
    amb: (a: A) => Iterable<B>,
  ): (a: A) => Iterable<C>
} = MonadWithIndex.composeWithIndex

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Iterable<A>) => Iterable<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A, i: number) => B,
  ): (self: Iterable<A>) => Iterable<DoObject<N, A, B>>
} = MonadWithIndex.mapToWithIndex

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Iterable<(a: A, i: number) => B>,
  ): (self: Iterable<A>) => Iterable<DoObject<N, A, B>>
} = MonadWithIndex.flipApplyToWithIndex

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Iterable<B>,
  ): (self: Iterable<A>) => Iterable<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => Iterable<B>,
  ): (self: Iterable<A>) => Iterable<DoObject<N, A, B>>
} = MonadWithIndex.flatMapToWithIndex

export interface GenUtils {
  readonly $: <A>(
    self: Iterable<A> | (() => Iterable<A>),
  ) => IterableIterable<A>
  readonly where: (a: boolean) => Generator<unknown, void>
}

export interface IterableGenerator<A> {
  (genUtils: GenUtils): Generator<unknown, A>
}

export interface IterableIterable<A> {
  readonly [Symbol.iterator]: () => Generator<unknown, A>
}

function* makeIterable<A>(
  self: Iterable<A> | (() => Iterable<A>),
): IterableIterable<A> {
  return (yield self) as A
}

function* where(a: boolean) {
  if (!a) {
    return yield* makeIterable([])
  }
}

export const gen: {
  <A>(generator: IterableGenerator<A>): Iterable<A>
} = getIterableGen(Monad, {
  $: makeIterable,
  where,
})
