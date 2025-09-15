import * as equivalence from "../../typeclasses/Equivalence"
import { Duration } from "./duration"
import { equals } from "./utils"

export const Equivalence: equivalence.Equivalence<Duration> = {
  equals,
}
