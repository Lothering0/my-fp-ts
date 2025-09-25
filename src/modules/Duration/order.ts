import * as order from "../../typeclasses/Order"
import * as number from "../Number"
import { flow } from "../../utils/flow"
import { Duration } from "./duration"
import { toMilliseconds } from "./utils"

export const Order: order.Order<Duration> = {
  compare: y => flow (toMilliseconds, number.compare (toMilliseconds (y))),
}
