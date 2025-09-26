import * as monad from '../../typeclasses/Monad'
import * as monadWithIndex from '../../typeclasses/MonadWithIndex'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Applicative, ApplicativeWithIndex } from './applicative'
import { IterableHkt } from './iterable'

export const Monad = monad.create<IterableHkt>(Applicative, {
  flat: self => ({
    *[Symbol.iterator]() {
      for (const iterable of self) {
        yield* iterable
      }
    },
  }),
})

export const MonadWithIndex = monadWithIndex.create<IterableHkt, number>(
  ApplicativeWithIndex,
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

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Iterable<(a: A, i: number) => B>,
  ): (self: Iterable<A>) => Iterable<DoObject<N, A, B>>
} = MonadWithIndex.flapToWithIndex

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
