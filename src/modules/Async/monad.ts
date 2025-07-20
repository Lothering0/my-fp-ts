/* eslint-disable @typescript-eslint/no-explicit-any */
import * as A from "./async"
import { Sync } from "../Sync"
import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"
import { DoObject } from "../../types/DoObject"
import { overload } from "../../utils/overloads"

export const Monad = createMonad<A.AsyncHKT> ({
  ...Applicative,
  flat: self => () => A.toPromise (self).then (A.toPromise),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: A.Async<A.Async<A>>): A.Async<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => A.Async<B>): (self: A.Async<A>) => A.Async<B>
  <A, B>(self: A.Async<A>, amb: (a: A) => A.Async<B>): A.Async<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => A.Async<C>,
    amb: (a: A) => A.Async<B>,
  ): (a: A) => A.Async<C>
  <A, B, C>(
    bmc: (b: B) => A.Async<C>,
    amb: (a: A) => A.Async<B>,
    a: A,
  ): A.Async<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: A.Async<A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): A.Async<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: A.Async<A>,
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): A.Async<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: A.Async<(a: A) => B>,
  ): (self: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: A.Async<A>,
    name: Exclude<N, keyof A>,
    fab: A.Async<(a: A) => B>,
  ): A.Async<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: A.Async<B>,
  ): (self: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: A.Async<A>,
    name: Exclude<N, keyof A>,
    fb: A.Async<B>,
  ): A.Async<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => A.Async<B>,
  ): (self: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    self: A.Async<A>,
    name: Exclude<N, keyof A>,
    amb: (a: A) => A.Async<B>,
  ): A.Async<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(am_: (a: A) => A.Async<_>): (self: A.Async<A>) => A.Async<A>
  <A, _>(self: A.Async<A>, am_: (a: A) => A.Async<_>): A.Async<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: A.Async<A>) => A.Async<A>
  <A, _>(self: A.Async<A>, am_: (a: A) => Sync<_>): A.Async<A>
} = Monad.tapSync

export const parallel: {
  <N extends string | number | symbol, A, B>(
    fb: A.Async<B>,
  ): (fa: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: A.Async<A>,
    fb: A.Async<B>,
  ): A.Async<DoObject<N, A, B>>
} = overload (
  1,
  (fa, fb) => () =>
    Promise.all ([A.toPromise (fa), A.toPromise (fb)]).then (([a]) => a as any),
)

export const parallelTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: A.Async<B>,
  ): (fa: A.Async<A>) => A.Async<DoObject<N, A, B>>
  <N extends string | number | symbol, A, B>(
    fa: A.Async<A>,
    name: Exclude<N, keyof A>,
    fb: A.Async<B>,
  ): A.Async<DoObject<N, A, B>>
} = overload (
  2,
  <N extends string | number | symbol, A, B>(
    fa: A.Async<A>,
    name: Exclude<N, keyof A>,
    fb: A.Async<B>,
  ): A.Async<DoObject<N, A, B>> =>
    () =>
      Promise.all ([A.toPromise (fa), A.toPromise (fb)]).then (
        ([a, b]) => ({ [name]: b, ...a }) as any,
      ),
)
