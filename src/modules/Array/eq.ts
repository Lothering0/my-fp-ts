import { Eq } from "../../types/Eq"
import { overload } from "../../utils/overloads"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<A[]>
} = Eq => ({
  equals: overload (1, (xs, ys) => xs.every ((x, i) => Eq.equals (x, ys.at (i)!))),
})
