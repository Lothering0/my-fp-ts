import * as ord from "../../typeclasses/Ord"
import { flow } from "../../utils/flow"
import * as number from "../Number"
import { Duration } from "./duration"
import { toMilliseconds } from "./utils"

export const Ord: ord.Ord<Duration> = {
  compare: y => flow (toMilliseconds, number.compare (toMilliseconds (y))),
}
