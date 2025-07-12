import { Eq } from "../../types/Eq"
import { overload } from "../../utils/overloads"

export const getEq: {
  <A>(E: Eq<A>): Eq<A[]>
} = E => ({
  equals: overload (1, (xs, ys) => xs.every ((x, i) => E.equals (x, ys.at (i)!))),
})
