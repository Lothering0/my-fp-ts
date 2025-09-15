import * as readonlyArray from "../ReadonlyArray"
import * as order from "../../typeclasses/Order"
import { NonEmptyReadonlyArray } from "./non-empty-readonly-array"

export const getOrder: {
  <A>(Order: order.Order<A>): order.Order<NonEmptyReadonlyArray<A>>
} = readonlyArray.getOrder
