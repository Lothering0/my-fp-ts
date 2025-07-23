import { Eq } from "../../types/Eq"
import { overload } from "../../utils/overloads"
import { length } from "./utils"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<ReadonlyArray<A>>
} = Eq => ({
  equals: overload (
    1,
    (xs, ys) =>
      length (xs) === length (ys) && xs.every ((x, i) => Eq.equals (x, ys.at (i)!)),
  ),
})
