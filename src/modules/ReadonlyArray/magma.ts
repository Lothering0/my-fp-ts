import * as boolean from "../Boolean"
import { Eq } from "../../typeclasses/Eq"
import { Magma } from "../../typeclasses/Magma"
import { pipe } from "../../utils/flow"
import { elem } from "./utils"
import { filter } from "./filterable"

export const getDifferenceMagma = <A>(Eq: Eq<A>): Magma<ReadonlyArray<A>> => ({
  combine: ys => filter (x => pipe (ys, elem (Eq) (x), boolean.not)),
})
