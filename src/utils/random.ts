import * as A from "../modules/Array"
import * as Io from "../modules/Io"
import { NonEmptyArray } from "../modules/NonEmptyArray"
import { pipe, flow } from "./flow"

export const random: Io.Io<number> = () => Math.random ()

export const randomBool: Io.Io<boolean> = Io.map (random, n => n > 0.5)

export const randomFloat: {
  (min: number, max: number): Io.Io<number>
} = (min, max) => Io.map (random, n => n * (max - min) + min)

export const randomInt: {
  (min: number, max: number): Io.Io<number>
} = flow (randomFloat, Io.map (Math.round))

export const randomElem: {
  <A>(as: NonEmptyArray<A>): Io.Io<A>
} = as =>
  pipe (
    randomInt (0, A.length (as) - 1),
    Io.map (n => as.at (n)!),
  )
