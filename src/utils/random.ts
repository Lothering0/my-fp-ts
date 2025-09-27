import * as Array from '../modules/ReadonlyArray'
import * as Sync from '../modules/Sync'
import { NonEmptyReadonlyArray } from '../modules/NonEmptyReadonlyArray'
import { pipe, flow } from './flow'

export const random: Sync.Sync<number> = () => Math.random()

export const randomBool: Sync.Sync<boolean> = pipe(
  random,
  Sync.map(n => n > 0.5),
)

export const randomFloat: {
  (min: number, max: number): Sync.Sync<number>
} = (min, max) =>
  pipe(
    random,
    Sync.map(n => n * (max - min) + min),
  )

export const randomInt: {
  (min: number, max: number): Sync.Sync<number>
} = flow(randomFloat, Sync.map(Math.round))

export const randomElem: {
  <A>(as: NonEmptyReadonlyArray<A>): Sync.Sync<A>
} = as =>
  pipe(
    randomInt(0, Array.length(as) - 1),
    Sync.map(n => as.at(n)!),
  )
