import { createExtendable } from "../../types/Extendable"
import { overload } from "../../utils/overloads"
import { Result, ResultHKT } from "./result"
import { Functor, map } from "./functor"

export const Extendable = createExtendable<ResultHKT> ({
  ...Functor,
  extend: overload (
    1,
    <_, A, B>(self: Result<_, A>, fab: (fa: Result<_, A>) => B): Result<_, B> =>
      map (self, () => fab (self)),
  ),
})

export const extend: {
  <_, A, B>(fab: (fa: Result<_, A>) => B): (self: Result<_, A>) => Result<_, B>
  <_, A, B>(self: Result<_, A>, fab: (fa: Result<_, A>) => B): Result<_, B>
} = Extendable.extend

export const duplicate: {
  <_, A>(self: Result<_, A>): Result<_, Result<_, A>>
} = Extendable.duplicate
