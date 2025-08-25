import { Eq } from "../../types/Eq"
import { pipe } from "../../utils/flow"
import { ReadonlyRecord } from "./readonly-record"
import { has, every } from "./utils"

export const getEq: {
  <A, K extends string>(Eq: Eq<A>): Eq<ReadonlyRecord<K, A>>
} = Eq => ({
  equals: x => y =>
    pipe (
      x,
      every ((a, k) => pipe (y, has (k)) && Eq.equals (a) (y[k])),
    ),
})
