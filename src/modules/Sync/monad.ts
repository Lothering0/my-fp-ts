import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { Applicative } from "./applicative"
import { SyncHkt, Sync, execute } from "./sync"

export const Monad = createMonad<SyncHkt> ({
  ...Applicative,
  flat: execute,
})

export const Do = Monad.Do

export const flat: {
  <A>(self: Sync<Sync<A>>): Sync<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => Sync<B>): (self: Sync<A>) => Sync<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(bmc: (b: B) => Sync<C>, amb: (a: A) => Sync<B>): (a: A) => Sync<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Sync<(a: A) => B>,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Sync<B>,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Sync<B>,
  ): (self: Sync<A>) => Sync<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A>(f: (a: A) => Sync<unknown>): (self: Sync<A>) => Sync<A>
} = Monad.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): (self: Sync<A>) => Sync<A>
} = Monad.tapSync
