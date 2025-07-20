import { createMonad } from "../../types/Monad"
import { DoObject } from "../../types/DoObject"
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
  <A, B>(self: Identity<A>, amb: (a: A) => Identity<B>): Identity<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => Identity<C>,
    amb: (a: A) => Identity<B>,
  ): (a: A) => Identity<C>
  <A, B, C>(
    bmc: (b: B) => Identity<C>,
    amb: (a: A) => Identity<B>,
    a: A,
  ): Identity<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Identity<A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): Identity<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Identity<A>,
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): Identity<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: Identity<(a: A) => B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Identity<A>,
    name: Exclude<N, keyof A>,
    fab: Identity<(a: A) => B>,
  ): Identity<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: Identity<B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Identity<A>,
    name: Exclude<N, keyof A>,
    fb: Identity<B>,
  ): Identity<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Identity<B>,
  ): (self: Identity<A>) => Identity<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: Identity<A>,
    name: Exclude<N, keyof A>,
    amb: (a: A) => Identity<B>,
  ): Identity<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(am_: (a: A) => Identity<_>): (self: Identity<A>) => Identity<A>
  <A, _>(self: Identity<A>, am_: (a: A) => Identity<_>): Identity<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: Identity<A>) => Identity<A>
  <A, _>(self: Identity<A>, am_: (a: A) => Sync<_>): Identity<A>
} = Monad.tapSync
