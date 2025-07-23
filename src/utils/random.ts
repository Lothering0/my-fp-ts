import * as RA from "../modules/ReadonlyArray"
import * as S from "../modules/Sync"
import { NonEmptyReadonlyArray } from "../modules/NonEmptyReadonlyArray"
import { pipe, flow } from "./flow"

export const random: S.Sync<number> = () => Math.random ()

export const randomBool: S.Sync<boolean> = S.map (random, n => n > 0.5)

export const randomFloat: {
  (min: number, max: number): S.Sync<number>
} = (min, max) => S.map (random, n => n * (max - min) + min)

export const randomInt: {
  (min: number, max: number): S.Sync<number>
} = flow (randomFloat, S.map (Math.round))

export const randomElem: {
  <A>(as: NonEmptyReadonlyArray<A>): S.Sync<A>
} = as =>
  pipe (
    randomInt (0, RA.length (as) - 1),
    S.map (n => as.at (n)!),
  )
