import * as iterable from "../Iterable"
import { Tree } from "./tree"
import { Eq } from "../../typeclasses/Eq"
import { forest, value } from "./utils"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<Tree<A>>
} = Eq => ({
  equals: mx => my =>
    Eq.equals (value (mx)) (value (my)) &&
    iterable.getEq (getEq (Eq)).equals (forest (mx)) (forest (my)),
})
