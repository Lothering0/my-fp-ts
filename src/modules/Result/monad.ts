import { Sync } from "../Sync"
import { Applicative } from "./applicative"
import { failure, Result, ResultHKT } from "./result"
import { match } from "./utils"
import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { identity } from "../Identity"

export const Monad = createMonad<ResultHKT> ({
  ...Applicative,
  flat: match (failure, identity),
})

export const Do = Monad.Do

export const flat: {
  <_, A>(self: Result<_, Result<_, A>>): Result<_, A>
} = Monad.flat

export const flatMap: {
  <_, A, B>(amb: (a: A) => Result<_, B>): (self: Result<_, A>) => Result<_, B>
} = Monad.flatMap

export const compose: {
  <_, A, B, C>(
    bmc: (b: B) => Result<_, C>,
    amb: (a: A) => Result<_, B>,
  ): (a: A) => Result<_, C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <_>(self: Result<_, A>) => Result<_, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <_>(self: Result<_, A>) => Result<_, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, _, A, B>(
    name: Exclude<N, keyof A>,
    fab: Result<_, (a: A) => B>,
  ): (self: Result<_, A>) => Result<_, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, _, A, B>(
    name: Exclude<N, keyof A>,
    fb: Result<_, B>,
  ): (self: Result<_, A>) => Result<_, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, _, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Result<_, B>,
  ): (self: Result<_, A>) => Result<_, DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <_, A, _2>(am_: (a: A) => Result<_, _2>): (self: Result<_, A>) => Result<_, A>
} = Monad.tap

export const tapSync: {
  <A, _>(am_: (a: A) => Sync<_>): <_2>(self: Result<_2, A>) => Result<_2, A>
} = Monad.tapSync
