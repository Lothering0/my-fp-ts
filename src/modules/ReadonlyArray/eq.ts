import { Eq } from "../../typeclasses/Eq"
import { length } from "./utils"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<ReadonlyArray<A>>
} = Eq => ({
  equals: xs => ys =>
    length (xs) === length (ys) && xs.every ((x, i) => Eq.equals (x) (ys.at (i)!)),
})
