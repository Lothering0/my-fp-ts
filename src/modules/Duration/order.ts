import * as order from "../../typeclasses/Order"
import { flow } from "../../utils/flow"
import * as number from "../Number"
import { Duration } from "./duration"
import { toMilliseconds } from "./utils"

export const Order: order.Order<Duration> = {
  compare: y => flow (toMilliseconds, number.compare (toMilliseconds (y))),
}
