import * as Monad_ from '../../typeclasses/Monad'
import * as MonadWithIndex_ from '../../typeclasses/MonadWithIndex'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Functor, FunctorWithIndex } from './functor'
import { FromIdentity } from './from-identity'
import { IterableHkt } from './iterable'

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

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Iterable<B>,
  ): (self: Iterable<A>) => Iterable<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => Iterable<B>,
  ): (self: Iterable<A>) => Iterable<DoObject<N, A, B>>
} = MonadWithIndex.flatMapToWithIndex
