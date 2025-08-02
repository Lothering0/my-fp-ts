import { Sync } from "../Sync"
import { Applicative } from "./applicative"
import { fail, Result, ResultHKT } from "./result"
import { match } from "./utils"
import { createMonad } from "../../types/Monad"
import { DoObject, DoObjectKey } from "../../types/DoObject"
import { identity } from "../Identity"

export const Monad = createMonad<ResultHKT> ({
  ...Applicative,
  flat: match (fail, identity),
})

export const Do = Monad.Do

export const flat: {
  <E1, E2, A>(self: Result<E1, Result<E2, A>>): Result<E1 | E2, A>
} = Monad.flat

export const flatMap: {
  <E1, A, B>(
    amb: (a: A) => Result<E1, B>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, B>
} = Monad.flatMap

export const compose: {
  <E1, E2, A, B, C>(
    bmc: (b: B) => Result<E2, C>,
    amb: (a: A) => Result<E1, B>,
  ): (a: A) => Result<E1 | E2, C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <E>(self: Result<E, A>) => Result<E, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <E>(self: Result<E, A>) => Result<E, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fab: Result<E1, (a: A) => B>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    fb: Result<E1, B>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, E1, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Result<E1, B>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, DoObject<N, A, B>>
} = Monad.flatMapTo

export const tap: {
  <E1, A>(
    f: (a: A) => Result<E1, unknown>,
  ): <E2>(self: Result<E2, A>) => Result<E1 | E2, A>
} = Monad.tap

export const tapSync: {
  <A>(f: (a: A) => Sync<unknown>): <E>(self: Result<E, A>) => Result<E, A>
} = Monad.tapSync
