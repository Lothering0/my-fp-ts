import * as Array from '../modules/ReadonlyArray'
import * as Sync from '../modules/Sync'
import * as Effect from '../modules/Effect'
import { pipe, flow } from './flow'

export const numberSync: Sync.Sync<number> = () => Math.random()

export const number: Effect.Effect<number> = Effect.fromSync(numberSync)

export const booleanSync: Sync.Sync<boolean> = pipe(
  numberSync,
  Sync.map(n => n > 0.5),
)

export const boolean: Effect.Effect<boolean> = Effect.fromSync(booleanSync)

export const floatSync: {
  (min: number, max: number): Sync.Sync<number>
} = (min, max) =>
  pipe(
    numberSync,
    Sync.map(n => n * (max - min) + min),
  )

export const float: {
  (min: number, max: number): Effect.Effect<number>
} = flow(floatSync, Effect.fromSync)

export const intSync: {
  (min: number, max: number): Sync.Sync<number>
} = flow(floatSync, Sync.map(Math.round))

export const int: {
  (min: number, max: number): Effect.Effect<number>
} = flow(intSync, Effect.fromSync)

export const elemSync: {
  <A>(as: Array.NonEmpty<A>): Sync.Sync<A>
} = as =>
  pipe(
    intSync(0, Array.length(as) - 1),
    Sync.map(n => as.at(n)!),
  )

export const elem: {
  <A>(as: Array.NonEmpty<A>): Effect.Effect<A>
} = flow(elemSync, Effect.fromSync)
