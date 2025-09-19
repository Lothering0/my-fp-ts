import * as boolean from "../Boolean"
import { Equivalence } from "../../typeclasses/Equivalence"
import { Magma } from "../../typeclasses/Magma"
import { pipe } from "../../utils/flow"
import { elem } from "./utils"
import { filter } from "./filterable"

/** Returns a `Magma` where `combine` operation returns elements of first array which is not contained by second */
export const getDifferenceMagma = <A>(
  Equivalence: Equivalence<A>,
): Magma<ReadonlyArray<A>> => ({
  combine: ys => filter (x => pipe (ys, elem (Equivalence) (x), boolean.not)),
})
