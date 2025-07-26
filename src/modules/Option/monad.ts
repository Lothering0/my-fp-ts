import * as O from "./option"
import * as R from "../Result"
import { Sync } from "../Sync"
import { createMonad } from "../../types/Monad"
import { DoObject } from "../../types/DoObject"
import { map } from "./functor"
import { Applicative } from "./applicative"
import { identity } from "../Identity"
import { match } from "./utils"
import { zero } from "./alternative"
import { pipe } from "../../utils/flow"
import { constant } from "../../utils/constant"

export const Monad = createMonad<O.OptionHKT> ({
  ...Applicative,
  flat: match (zero, identity),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: O.Option<O.Option<A>>): O.Option<A>
} = Monad.flat

export const flatMap: {
  <A, B>(amb: (a: A) => O.Option<B>): (self: O.Option<A>) => O.Option<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => O.Option<C>,
    amb: (a: A) => O.Option<B>,
  ): (a: A) => O.Option<C>
} = Monad.compose

export const setTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: O.Option<A>) => O.Option<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: O.Option<A>) => O.Option<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fab: O.Option<(a: A) => B>,
  ): (self: O.Option<A>) => O.Option<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: O.Option<B>,
  ): (self: O.Option<A>) => O.Option<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => O.Option<B>,
  ): (self: O.Option<A>) => O.Option<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(am_: (a: A) => O.Option<_>): (self: O.Option<A>) => O.Option<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: O.Option<A>) => O.Option<A>
} = Monad.tapSync

export const tapResult: {
  <E, A, _>(afe: (a: A) => R.Result<E, _>): (self: O.Option<A>) => O.Option<A>
} = afe => self => pipe (self, map (afe), flatMap (R.match (zero, constant (self))))
