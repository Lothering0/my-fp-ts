import { Monoid } from "../../typeclasses/Monoid"
import { Duration } from "./duration"
import { SemigroupSum } from "./semigroup"

export const empty: Duration = { milliseconds: 0 }

export const MonoidSum: Monoid<Duration> = {
  ...SemigroupSum,
  empty,
}
