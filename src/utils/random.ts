import * as A from "../modules/Array"
import * as Io from "../modules/Io"
import { NonEmptyArray } from "../modules/NonEmptyArray"
import { pipe, flow } from "./flow"

export const random: Io.Io<number> = () => Math.random ()

export const randomBool: Io.Io<boolean> = Io.map (random, n => n > 0.5)

type RandomFloat = (min: number, max: number) => Io.Io<number>
export const randomFloat: RandomFloat = (min, max) =>
  Io.map (random, n => n * (max - min) + min)

type RandomInt = (min: number, max: number) => Io.Io<number>
export const randomInt: RandomInt = flow (randomFloat, Io.map (Math.round))

type RandomElem = <A>(as: NonEmptyArray<A>) => Io.Io<A>
export const randomElem: RandomElem = as =>
  pipe (
    randomInt (0, A.length (as)),
    Io.map (n => as.at (n)!),
  )
