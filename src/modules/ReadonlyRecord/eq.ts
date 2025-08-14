import { Eq } from "../../types/Eq"
import { pipe } from "../../utils/flow"
import { ReadonlyRecord } from "./readonly-record"
import { has, everyWithIndex } from "./utils"

export const getEq: {
  <K extends string, A>(Eq: Eq<A>): Eq<ReadonlyRecord<K, A>>
} = Eq => ({
  equals: x => y =>
    pipe (
      x,
      everyWithIndex ((k, a) => pipe (y, has (k)) && Eq.equals (a) (y[k])),
    ),
})
