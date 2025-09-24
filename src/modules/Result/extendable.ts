import { create } from "../../typeclasses/Extendable"
import { Result, ResultHkt } from "./result"
import { Functor, map } from "./functor"

export const Extendable = create<ResultHkt> (Functor, {
  extend: fab => self => map (() => fab (self)) (self),
})

export const extend: {
  <E, A, B>(fab: (fa: Result<E, A>) => B): (self: Result<E, A>) => Result<E, B>
} = Extendable.extend

export const duplicate: {
  <E, A>(self: Result<E, A>): Result<E, Result<E, A>>
} = Extendable.duplicate
