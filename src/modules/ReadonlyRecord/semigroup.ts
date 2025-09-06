import * as option from "../Option"
import { Semigroup } from "../../typeclasses/Semigroup"
import { pipe } from "../../utils/flow"
import { filterMap } from "./filterable"
import { ReadonlyRecord } from "./readonly-record"
import { lookup } from "./utils"

export const getIntersectionSemigroup: {
  <A>(Semigroup: Semigroup<A>): Semigroup<ReadonlyRecord<string, A>>
} = Semigroup => ({
  combine: ys => xs =>
    pipe (
      xs,
      filterMap ((x, k) =>
        pipe (ys, lookup (k), option.map (Semigroup.combine (x))),
      ),
    ),
})
