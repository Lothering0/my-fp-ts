import * as iterable from "../Iterable"
import { Tree } from "./tree"
import { Equivalence } from "../../typeclasses/Equivalence"
import { forest, value } from "./utils"

export const getEquivalence: {
  <A>(Equivalence: Equivalence<A>): Equivalence<Tree<A>>
} = Equivalence => ({
  equals: mx => my =>
    Equivalence.equals (value (mx)) (value (my)) &&
    iterable.getEquivalence (getEquivalence (Equivalence)).equals (forest (mx)) (
      forest (my),
    ),
})
