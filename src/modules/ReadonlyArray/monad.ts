import { ReadonlyArrayHkt } from "./readonly-array"
import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { Applicative, ApplicativeWithIndex } from "./applicative"
import { createMonadWithIndex } from "../../types/MonadWithIndex"

export const Monad = createMonad<ReadonlyArrayHkt> ({
  ...Applicative,
  flat: self => self.flat (),
})

export const MonadWithIndex = createMonadWithIndex<ReadonlyArrayHkt, number> ({
  ...ApplicativeWithIndex,
  ...Monad,
})

export const Do = Monad.Do

export const flat: {
  <A>(self: ReadonlyArray<ReadonlyArray<A>>): ReadonlyArray<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A, i: number) => ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<B>
} = MonadWithIndex.flatMapWithIndex

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

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: ReadonlyArray<(a: A, i: number) => B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.flapToWithIndex

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A, i: number) => ReadonlyArray<B>,
  ): (self: ReadonlyArray<A>) => ReadonlyArray<DoObject<N, A, B>>
} = MonadWithIndex.flatMapToWithIndex
