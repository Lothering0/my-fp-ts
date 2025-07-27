import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { Applicative } from "./applicative"
import { Identity, IdentityHKT, identity } from "./identity"
import { Sync } from "../Sync"

export const Monad = createMonad<IdentityHKT> ({
  ...Applicative,
  flat: identity,
})

export const Do = Monad.Do

export const flat: {
  <A>(self: Identity<Identity<A>>): Identity<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => Identity<B>): (self: Identity<A>) => Identity<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => Identity<C>,
    amb: (a: A) => Identity<B>,
  ): (a: A) => Identity<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Identity<(a: A) => B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Identity<B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Identity<B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(am_: (a: A) => Identity<_>): (self: Identity<A>) => Identity<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: Identity<A>) => Identity<A>
} = Monad.tapSync
