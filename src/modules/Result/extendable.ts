import { createExtendable } from "../../types/Extendable"
import { Result, ResultHKT } from "./result"
import { Functor, map } from "./functor"

export const Extendable = createExtendable<ResultHKT> ({
  ...Functor,
  extend: fab => self => map (() => fab (self)) (self),
})

export const extend: {
  <_, A, B>(fab: (fa: Result<_, A>) => B): (self: Result<_, A>) => Result<_, B>
} = Extendable.extend

export const duplicate: {
  <_, A>(self: Result<_, A>): Result<_, Result<_, A>>
} = Extendable.duplicate
