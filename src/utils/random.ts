import * as Array from '../modules/ReadonlyArray'
import * as Sync from '../modules/Sync'
import * as Effect from '../modules/Effect'
import { NonEmptyReadonlyArray } from '../modules/NonEmptyReadonlyArray'
import { pipe, flow } from './flow'

export const randomSync: Sync.Sync<number> = () => Math.random()

export const random: Effect.Effect<number> = Effect.fromSync(randomSync)

export const randomBooleanSync: Sync.Sync<boolean> = pipe(
  randomSync,
  Sync.map(n => n > 0.5),
)

export const randomBoolean: Effect.Effect<boolean> =
  Effect.fromSync(randomBooleanSync)

export const randomFloatSync: {
  (min: number, max: number): Sync.Sync<number>
} = (min, max) =>
  pipe(
    randomSync,
    Sync.map(n => n * (max - min) + min),
  )

export const randomFloat: {
  (min: number, max: number): Effect.Effect<number>
} = flow(randomFloatSync, Effect.fromSync)

export const randomIntSync: {
  (min: number, max: number): Sync.Sync<number>
} = flow(randomFloatSync, Sync.map(Math.round))

export const randomInt: {
  (min: number, max: number): Effect.Effect<number>
} = flow(randomIntSync, Effect.fromSync)

export const randomElemSync: {
  <A>(as: NonEmptyReadonlyArray<A>): Sync.Sync<A>
} = as =>
  pipe(
    randomIntSync(0, Array.length(as) - 1),
    Sync.map(n => as.at(n)!),
  )

export const randomElem: {
  <A>(as: NonEmptyReadonlyArray<A>): Effect.Effect<A>
} = flow(randomElemSync, Effect.fromSync)
