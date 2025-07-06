import { overload } from "../../utils/overloads"
import { Extendable } from "../../types/Extendable"
import { Result, ResultHKT } from "./result"
import { functor, map } from "./functor"

export const extendable: Extendable<ResultHKT> = {
  ...functor,
  extend: overload (
    1,
    <_, A, B>(self: Result<_, A>, fab: (fa: Result<_, A>) => B): Result<_, B> =>
      map (self, () => fab (self)),
  ),
}

export const { extend } = extendable
