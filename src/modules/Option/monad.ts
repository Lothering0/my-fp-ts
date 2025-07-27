import * as option from "./option"
import * as result from "../Result"
import { Sync } from "../Sync"
import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { map } from "./functor"
import { Applicative } from "./applicative"
import { identity } from "../Identity"
import { match } from "./utils"
import { zero } from "./alternative"
import { pipe } from "../../utils/flow"
import { constant } from "../../utils/constant"

export const Monad = createMonad<option.OptionHKT> ({
  ...Applicative,
  flat: match (zero, identity),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: option.Option<option.Option<A>>): option.Option<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => option.Option<B>,
  ): (self: option.Option<A>) => option.Option<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => option.Option<C>,
    amb: (a: A) => option.Option<B>,
  ): (a: A) => option.Option<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: option.Option<A>) => option.Option<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: option.Option<A>) => option.Option<DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: option.Option<(a: A) => B>,
  ): (self: option.Option<A>) => option.Option<DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: option.Option<B>,
  ): (self: option.Option<A>) => option.Option<DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => option.Option<B>,
  ): (self: option.Option<A>) => option.Option<DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <A, _>(
    am_: (a: A) => option.Option<_>,
  ): (self: option.Option<A>) => option.Option<A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): (self: option.Option<A>) => option.Option<A>
} = Monad.tapSync

export const tapResult: {
  <E, A, _>(
    afe: (a: A) => result.Result<E, _>,
  ): (self: option.Option<A>) => option.Option<A>
} = afe => self =>
  pipe (self, map (afe), flatMap (result.match (zero, constant (self))))
