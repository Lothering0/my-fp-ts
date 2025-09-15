import { Equivalence } from "../../typeclasses/Equivalence"
import { pipe } from "../../utils/flow"
import { ReadonlyRecord } from "./readonly-record"
import { has, every } from "./utils"

export const getEquivalence: {
  <A, K extends string>(
    Equivalence: Equivalence<A>,
  ): Equivalence<ReadonlyRecord<K, A>>
} = Equivalence => ({
  equals: x => y =>
    pipe (
      x,
      every ((a, k) => pipe (y, has (k)) && Equivalence.equals (a) (y[k])),
    ),
})
