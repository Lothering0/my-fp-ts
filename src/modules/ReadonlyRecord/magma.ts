import * as boolean from "../Boolean"
import { Magma } from "../../typeclasses/Magma"
import { concat, has } from "./utils"
import { ReadonlyRecord } from "./readonly-record"
import { filter } from "./filterable"
import { pipe } from "../../utils/flow"

export const getDifferenceMagma: {
  <A>(): Magma<ReadonlyRecord<string, A>>
} = () => ({
  combine: y => x =>
    pipe (
      x,
      concat (y),
      filter ((_, k) => pipe (has (k) (x), boolean.and (has (k) (y)), boolean.not)),
    ),
})
