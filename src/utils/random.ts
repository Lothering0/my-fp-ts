import * as readonlyArray from "../modules/ReadonlyArray"
import * as sync from "../modules/Sync"
import { NonEmptyReadonlyArray } from "../modules/NonEmptyReadonlyArray"
import { pipe, flow } from "./flow"

export const random: sync.Sync<number> = () => Math.random ()

export const randomBool: sync.Sync<boolean> = pipe (
  random,
  sync.map (n => n > 0.5),
)

export const randomFloat: {
  (min: number, max: number): sync.Sync<number>
} = (min, max) =>
  pipe (
    random,
    sync.map (n => n * (max - min) + min),
  )

export const randomInt: {
  (min: number, max: number): sync.Sync<number>
} = flow (randomFloat, sync.map (Math.round))

export const randomElem: {
  <A>(as: NonEmptyReadonlyArray<A>): sync.Sync<A>
} = as =>
  pipe (
    randomInt (0, readonlyArray.length (as) - 1),
    sync.map (n => as.at (n)!),
  )
